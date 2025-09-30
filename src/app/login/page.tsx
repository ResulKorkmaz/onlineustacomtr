"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    // Onboarding'den geliyorsa bilgilendirme göster
    if (redirect === "onboarding") {
      const role = localStorage.getItem("onboarding_role");
      const kind = localStorage.getItem("onboarding_kind");
      console.log("Onboarding seçimleri:", { role, kind });
    }
  }, [redirect]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const redirectPath = redirect === "onboarding" ? "/onboarding" : "/dashboard";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectPath}`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl">📧</div>
          <h2 className="mb-2 text-2xl font-bold">E-posta Gönderildi</h2>
          <p className="text-gray-600">
            <strong>{email}</strong> adresine giriş bağlantısı gönderdik.
            Lütfen e-postanızı kontrol edin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Giriş Yap / Kayıt Ol</h1>
        
        {redirect === "onboarding" && (
          <div className="mb-6 rounded-lg bg-sky-50 p-4">
            <p className="text-sm text-sky-900">
              ✓ Seçimleriniz kaydedildi. Giriş yaptıktan sonra profiliniz oluşturulacak.
            </p>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">E-posta Adresi</label>
            <Input
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={error}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Giriş Bağlantısı Gönder"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          E-posta adresinize gönderilecek bağlantı ile güvenli giriş yapabilirsiniz.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
