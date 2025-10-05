"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect");
  const typeParam = searchParams.get("type") as "customer" | "provider" | null;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "provider">(typeParam || "customer");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    // URL parametresinden type varsa set et
    if (typeParam) {
      setUserType(typeParam);
    }
  }, [typeParam]);

  useEffect(() => {
    // Onboarding'den geliyorsa bilgilendirme göster
    if (redirect === "onboarding") {
      const role = localStorage.getItem("onboarding_role");
      const kind = localStorage.getItem("onboarding_kind");
      console.log("Onboarding seçimleri:", { role, kind });
    }
  }, [redirect]);

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Şifre sıfırlama modundaysa
    if (resetMode) {
      return handlePasswordReset(e);
    }

    // Normal giriş ise user type'ı kaydet
    if (redirect !== "onboarding") {
      localStorage.setItem("onboarding_role", userType);
    }

    // Redirect path belirleme
    let redirectPath = "/dashboard";
    if (redirect === "onboarding") {
      redirectPath = "/customer/register";
    } else if (redirect === "admin") {
      redirectPath = "/admin";
    } else if (redirect) {
      redirectPath = `/${redirect}`;
    }

    // E-posta ve şifre ile giriş
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Kullanıcı dostu hata mesajları
      if (error.message.toLowerCase().includes("rate limit")) {
        setError("Çok fazla giriş denemesi yaptınız. Lütfen 1-2 saat sonra tekrar deneyin. Bu güvenlik önlemi kötüye kullanımı engellemek içindir.");
      } else if (error.message.includes("Invalid login credentials")) {
        setError("E-posta veya şifre hatalı. Eğer yeni kayıt olduysanız, lütfen e-postanızdaki onay linkine tıklayın.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("E-posta adresiniz henüz onaylanmamış. Lütfen gelen kutunuzu kontrol edin.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      // Başarılı giriş - hard redirect ile admin panele git
      console.log("[Login Success] Redirecting to:", redirectPath);
      window.location.href = redirectPath;
    }
  }

  if (sent) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl">📧</div>
          <h2 className="mb-2 text-2xl font-bold">E-posta Gönderildi</h2>
          <p className="text-gray-600">
            <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
            Lütfen e-postanızı kontrol edin.
          </p>
          <Button 
            onClick={() => { setSent(false); setResetMode(false); }} 
            variant="ghost" 
            className="mt-4"
          >
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">
          {redirect === "admin" 
            ? "🛡️ Admin Panel Giriş" 
            : redirect === "onboarding" 
            ? "Kayıt Ol" 
            : resetMode 
            ? "Şifre Sıfırlama" 
            : "Giriş Yap"}
        </h1>
        
        {redirect === "admin" && (
          <div className="mb-6 rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 p-4">
            <p className="text-sm font-medium text-sky-900">
              🔐 Admin paneline erişim için yetkiniz olmalıdır.
            </p>
          </div>
        )}

        {redirect === "onboarding" && (
          <div className="mb-6 rounded-lg bg-sky-50 p-4">
            <p className="text-sm text-sky-900">
              ✓ Seçimleriniz kaydedildi. Giriş yaptıktan sonra profiliniz oluşturulacak.
            </p>
          </div>
        )}

        {resetMode && (
          <p className="mb-6 text-sm text-gray-600">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          {!resetMode && redirect !== "onboarding" && redirect !== "admin" && (
            <div>
              <label className="mb-3 block text-sm font-medium">Giriş Türü</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("customer")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    userType === "customer"
                      ? "border-sky-500 bg-sky-50 text-sky-900"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">👤</span>
                  <span className="text-sm font-medium">Müşteri</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("provider")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    userType === "provider"
                      ? "border-sky-500 bg-sky-50 text-sky-900"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">🔧</span>
                  <span className="text-sm font-medium">Hizmet Veren</span>
                </button>
              </div>
            </div>
          )}

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

          {!resetMode && (
            <div>
              <label className="mb-2 block text-sm font-medium">Şifre</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!resetMode}
              />
            </div>
          )}

          {!resetMode && redirect !== "onboarding" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="text-sm text-sky-600 hover:text-sky-700 hover:underline"
              >
                Şifremi Unuttum
              </button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading 
              ? "İşleniyor..." 
              : resetMode 
                ? "Sıfırlama Bağlantısı Gönder" 
                : redirect === "onboarding" 
                  ? "Kayıt Ol" 
                  : "Giriş Yap"
            }
          </Button>

          {resetMode && (
            <button
              type="button"
              onClick={() => setResetMode(false)}
              className="w-full text-sm text-gray-600 hover:text-gray-700"
            >
              Giriş sayfasına dön
            </button>
          )}
        </form>

        {!resetMode && redirect !== "onboarding" && redirect !== "admin" && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Hesabınız yok mu?{" "}
            <Link href="/signup" className="font-medium text-sky-600 hover:text-sky-700 hover:underline">
              Kayıt Ol
            </Link>
          </p>
        )}
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
