"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Kind = "individual" | "company" | "";

export default function OnboardingPage() {
  const [kind, setKind] = useState<Kind>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuth() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        // Giriş yapılmamış - direkt devam et
        setIsCheckingAuth(false);
        return;
      }

      setIsAuthenticated(true);
      
      // Profil var mı kontrol et (timeout ile)
      const profilePromise = supabase
        .from("profiles")
        .select("role, provider_kind")
        .eq("id", user.id)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );

      const { data: profile } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]).catch(() => ({ data: null })) as { data: { role?: string } | null };

      if (profile?.role) {
        // Profil tamamsa dashboard'a yönlendir
        router.push("/dashboard");
        return;
      }
    } catch (err) {
      console.error("Auth check error:", err);
    } finally {
      setIsCheckingAuth(false);
    }
  }

  async function handleSubmit() {
    if (!kind) return;
    
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Kullanıcı giriş yapmamışsa, seçimleri localStorage'a kaydet ve login'e yönlendir
      localStorage.setItem("onboarding_role", "provider");
      localStorage.setItem("onboarding_kind", kind);
      router.push("/login?redirect=onboarding");
      return;
    }

    // Kullanıcı giriş yapmışsa profili güncelle
    const updates = { 
      role: "provider" as const, 
      provider_kind: kind 
    };

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...updates })
      .eq("id", user.id);

    if (!error) {
      localStorage.removeItem("onboarding_role");
      localStorage.removeItem("onboarding_kind");
      router.push("/dashboard");
    }

    setLoading(false);
  }

  // localStorage'dan hizmet veren tipi yükle
  useEffect(() => {
    const savedKind = localStorage.getItem("onboarding_kind");
    if (savedKind) setKind(savedKind as Kind);
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">
          {isAuthenticated ? "Profilinizi Tamamlayın" : "Hizmet Veren Olarak Katılın"}
        </h1>
        <p className="mb-8 text-gray-600">
          {isAuthenticated 
            ? "Hizmet veren tipinizi seçerek devam edin."
            : "Hizmet veren tipinizi seçin, ardından güvenli giriş yaparak kayıt işleminizi tamamlayın."
          }
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-lg font-medium">Hizmet Veren Tipinizi Seçin</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setKind("individual")}
                className={`rounded-lg border-2 p-6 text-left transition ${
                  kind === "individual"
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="mb-3 text-4xl">👨‍🔧</div>
                <h3 className="mb-1 text-lg font-semibold">Şahıs</h3>
                <p className="text-sm text-gray-600">Bireysel çalışıyorum</p>
              </button>

              <button
                onClick={() => setKind("company")}
                className={`rounded-lg border-2 p-6 text-left transition ${
                  kind === "company"
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="mb-3 text-4xl">🏢</div>
                <h3 className="mb-1 text-lg font-semibold">Şirket</h3>
                <p className="text-sm text-gray-600">Şirket olarak hizmet veriyorum</p>
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!kind || loading}
            className="w-full"
            size="lg"
          >
            {loading 
              ? "İşlem yapılıyor..." 
              : isAuthenticated 
                ? "Profili Tamamla" 
                : "Devam Et (Giriş Yap / Kayıt Ol)"
            }
          </Button>

          {!isAuthenticated && (
            <div className="mt-6 space-y-3">
              <p className="text-center text-sm text-gray-500">
                Seçiminizi yaptıktan sonra e-posta ile güvenli giriş yapabilirsiniz.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-gray-500">Müşteri misiniz?</span>
                <a 
                  href="/login?type=customer" 
                  className="font-medium text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Müşteri Olarak Kayıt Ol
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
