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

  useEffect(() => {
    checkProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      // Profil varsa dashboard'a yönlendir
      router.push("/dashboard");
    } else {
      // Profil yoksa oluştur (placeholder)
      await supabase.from("profiles").insert({
        id: user.id,
        role: "customer",
      });
    }
  }

  async function handleSubmit() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates: { role: string; provider_kind?: string } = { role };
    if (role === "provider") {
      updates.provider_kind = kind;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (!error) {
      router.push("/dashboard");
    }

    setLoading(false);
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Hoş Geldiniz!</h1>
        <p className="mb-8 text-gray-600">
          Platformu kullanmaya başlamak için lütfen aşağıdaki bilgileri seçin.
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
          >
            {loading ? "Kaydediliyor..." : "Devam Et"}
          </Button>
        </div>
      </div>
    </div>
  );
}
