"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Role = "customer" | "provider" | "";
type Kind = "individual" | "company" | "";

export default function OnboardingPage() {
  const [role, setRole] = useState<Role>("");
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
    if (!role || (role === "provider" && !kind)) return;
    
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Kullanıcı giriş yapmamışsa, seçimleri localStorage'a kaydet ve login'e yönlendir
      localStorage.setItem("onboarding_role", role);
      if (role === "provider" && kind) {
        localStorage.setItem("onboarding_kind", kind);
      }
      router.push("/login?redirect=onboarding");
      return;
    }

    // Kullanıcı giriş yapmışsa profili güncelle
    const updates: { role: string; provider_kind?: string } = { role };
    if (role === "provider") {
      updates.provider_kind = kind;
    }

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

  // localStorage'dan seçimleri yükle
  useEffect(() => {
    const savedRole = localStorage.getItem("onboarding_role");
    const savedKind = localStorage.getItem("onboarding_kind");
    if (savedRole) setRole(savedRole as Role);
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
        <h1 className="mb-6 text-2xl font-bold">
          {isAuthenticated ? "Profilinizi Tamamlayın" : "Hizmet Veren Olarak Katılın"}
        </h1>
        <p className="mb-8 text-gray-600">
          {isAuthenticated 
            ? "Platformu kullanmaya başlamak için lütfen aşağıdaki bilgileri seçin."
            : "Önce rolünüzü seçin, ardından güvenli giriş yaparak kayıt işleminizi tamamlayın."
          }
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-3 block font-medium">Rolünüzü Seçin</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setRole("customer")}
                className={`rounded-lg border-2 p-6 text-left transition ${
                  role === "customer"
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-300 hover:border-gray-300"
                }`}
              >
                <div className="mb-2 text-2xl">👤</div>
                <h3 className="font-semibold">Müşteri</h3>
                <p className="text-sm text-gray-600">İlan oluşturup teklif alacağım</p>
              </button>

              <button
                onClick={() => setRole("provider")}
                className={`rounded-lg border-2 p-6 text-left transition ${
                  role === "provider"
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-300 hover:border-gray-300"
                }`}
              >
                <div className="mb-2 text-2xl">🔧</div>
                <h3 className="font-semibold">Hizmet Veren</h3>
                <p className="text-sm text-gray-600">İlanları görüp teklif vereceğim</p>
              </button>
            </div>
          </div>

          {role === "provider" && (
            <div>
              <label className="mb-3 block font-medium">Hizmet Veren Tipi</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setKind("individual")}
                  className={`rounded-lg border-2 p-6 text-left transition ${
                    kind === "individual"
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-300 hover:border-gray-300"
                  }`}
                >
                  <div className="mb-2 text-2xl">👨‍🔧</div>
                  <h3 className="font-semibold">Şahıs</h3>
                  <p className="text-sm text-gray-600">Bireysel çalışıyorum</p>
                </button>

                <button
                  onClick={() => setKind("company")}
                  className={`rounded-lg border-2 p-6 text-left transition ${
                    kind === "company"
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-300 hover:border-gray-300"
                  }`}
                >
                  <div className="mb-2 text-2xl">🏢</div>
                  <h3 className="font-semibold">Şirket</h3>
                  <p className="text-sm text-gray-600">Şirket olarak hizmet veriyorum</p>
                </button>
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!role || (role === "provider" && !kind) || loading}
            className="w-full"
            size="lg"
          >
            {loading 
              ? "İşlem yapılıyor..." 
              : isAuthenticated 
                ? "Profili Tamamla" 
                : "Giriş Yap / Kayıt Ol"
            }
          </Button>

          {!isAuthenticated && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Seçimlerinizi yaptıktan sonra e-posta ile güvenli giriş yapabilirsiniz.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
