"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CITIES, DISTRICTS } from "@/lib/constants";
import { User, Mail, Phone, Lock, MapPin, Briefcase, ChevronRight, ChevronLeft } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function CustomerRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userExists, setUserExists] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    district: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  // Email/telefon kontrolü (anlık)
  const checkUserExists = async () => {
    if (!formData.email && !formData.phone) return;

    try {
      const response = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await response.json();
      setUserExists(data.exists);
      
      if (data.exists) {
        setError(data.message || "Bu bilgiler ile kayıtlı kullanıcı bulundu. Giriş yapın.");
      } else {
        setError("");
      }
    } catch (err) {
      console.error("User check error:", err);
    }
  };

  // Email/telefon değiştiğinde kontrol et (500ms debounce)
  useEffect(() => {
    if (step === 2 && (formData.email || formData.phone)) {
      const timer = setTimeout(() => {
        checkUserExists();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.email, formData.phone, step]);

  // Adım 1: Ad Soyad + Şehir
  const handleStep1Next = () => {
    if (!formData.fullName || !formData.city) {
      setError("Lütfen ad soyad ve şehir bilgilerini doldurun");
      return;
    }
    setError("");
    setStep(2);
  };

  // Adım 2: Email + Telefon (Email kontrolü)
  const handleStep2Next = () => {
    if (!formData.email || !formData.phone) {
      setError("Lütfen e-posta ve telefon bilgilerini doldurun");
      return;
    }

    // Email validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Geçerli bir e-posta adresi girin");
      return;
    }

    // Kullanıcı zaten varsa ilerleme
    if (userExists) {
      setError("Bu bilgilerle kayıtlı kullanıcı var. Lütfen giriş yapın.");
      setTimeout(() => {
        router.push(`/login?email=${formData.email}&message=Zaten kayıtlı bir hesabınız var`);
      }, 2000);
      return;
    }

    // Devam et
    setError("");
    setStep(3);
  };

  // Adım 3: Şifre + Kayıt
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Şifre validasyonu
    if (formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);

    try {
      // 0. reCAPTCHA Doğrulama (Optional - production'da key varsa çalışır)
      if (executeRecaptcha) {
        try {
          const recaptchaToken = await executeRecaptcha("customer_register");
          
          const recaptchaResponse = await fetch("/api/verify-recaptcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: recaptchaToken }),
          });

          const recaptchaResult = await recaptchaResponse.json();
          
          if (!recaptchaResult.success) {
            console.warn("reCAPTCHA doğrulaması başarısız");
            // Production'da Vercel environment variables eklenince çalışacak
          }
        } catch (recaptchaError) {
          console.error("reCAPTCHA hatası:", recaptchaError);
          // reCAPTCHA hatası olsa bile devam et (key yoksa)
        }
      } else {
        console.warn("⚠️ reCAPTCHA key'leri Vercel'de tanımlı değil. VERCEL_RECAPTCHA_SETUP.md dosyasına bakın.");
      }

      // 1. Kullanıcı kaydı
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          },
        },
      });

      // Auth hata kontrolü - Rate limit ve diğer hatalar için kullanıcı dostu mesajlar
      if (authError) {
        if (authError.message.toLowerCase().includes("rate limit")) {
          throw new Error(
            "Çok fazla kayıt denemesi yaptınız. Lütfen 1-2 saat sonra tekrar deneyin. " +
            "Bu güvenlik önlemi kötüye kullanımı engellemek içindir."
          );
        } else if (authError.message.toLowerCase().includes("already registered")) {
          throw new Error("Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın veya farklı bir e-posta kullanın.");
        } else {
          throw new Error(authError.message || "Kayıt sırasında bir hata oluştu");
        }
      }
      if (!authData.user) throw new Error("Kullanıcı oluşturulamadı");

      // Email confirmation durumunu kontrol et
      const needsEmailConfirmation = authData.user && !authData.session;

      // 2. Müşteri profili oluşturma (retry mekanizması ile)
      const profileData = {
        id: authData.user.id,
        role: "customer" as const,
        provider_kind: null,
        full_name: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        district: formData.district,
        is_verified: false,
      };

      // Retry mekanizması: 5 deneme, her biri arasında 2 saniye bekle
      let profileCreated = false;
      let lastError = null;
      
      for (let attempt = 1; attempt <= 5; attempt++) {
        try {
          // Supabase'in kullanıcıyı kaydetmesi için her denemeden önce 2 saniye bekle
          await new Promise(resolve => setTimeout(resolve, 2000));

          const profileResponse = await fetch("/api/register-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData),
          });

          if (profileResponse.ok) {
            profileCreated = true;
            break;
          } else {
            const errorData = await profileResponse.json();
            lastError = errorData.error;
            console.log(`Profil oluşturma denemesi ${attempt}/5 başarısız:`, errorData.error);
          }
        } catch (err) {
          lastError = err instanceof Error ? err.message : "Bilinmeyen hata";
          console.log(`Profil oluşturma denemesi ${attempt}/5 hata:`, err);
        }
      }

      if (!profileCreated) {
        throw new Error(lastError || "Profil oluşturulamadı");
      }

      // Email onayı gerekiyorsa login'e, yoksa dashboard'a yönlendir
      if (needsEmailConfirmation) {
        setSuccess("Kayıt başarılı! E-postanıza gönderilen onay linkine tıklayarak hesabınızı aktifleştirin.");
        setTimeout(() => {
          router.push("/login?type=customer&message=Lütfen e-postanızı onaylayın");
        }, 3000);
      } else {
        setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => {
          router.push("/login?type=customer");
        }, 1500);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kayıt sırasında bir hata oluştu";
      setError(message);
      console.error("[CustomerRegister] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mb-3 text-5xl">👤</div>
          <h1 className="mb-2 text-2xl font-bold">Müşteri Kaydı</h1>
          <p className="text-sm text-gray-600">
            İhtiyacınız olan hizmeti bulun, en uygun teklifi alın
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? "text-sky-600" : "text-gray-400"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-sky-600 text-white" : "bg-gray-200"}`}>
                1
              </div>
              <span className="ml-2 text-xs font-medium">Kişisel</span>
            </div>
            <div className={`h-1 flex-1 mx-2 ${step >= 2 ? "bg-sky-600" : "bg-gray-200"}`}></div>
            <div className={`flex items-center ${step >= 2 ? "text-sky-600" : "text-gray-400"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-sky-600 text-white" : "bg-gray-200"}`}>
                2
              </div>
              <span className="ml-2 text-xs font-medium">İletişim</span>
            </div>
            <div className={`h-1 flex-1 mx-2 ${step >= 3 ? "bg-sky-600" : "bg-gray-200"}`}></div>
            <div className={`flex items-center ${step >= 3 ? "text-sky-600" : "text-gray-400"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-sky-600 text-white" : "bg-gray-200"}`}>
                3
              </div>
              <span className="ml-2 text-xs font-medium">Güvenlik</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* Adım 1: Ad Soyad + Şehir */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Ad Soyad <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Adınız ve soyadınız"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Şehir <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value, district: "" })}
                  className="pl-10"
                  required
                >
                  <option value="">Şehir seçin</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {formData.city && (
              <div>
                <label className="mb-2 block text-sm font-medium">İlçe</label>
                <Select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                >
                  <option value="">İlçe seçin</option>
                  {DISTRICTS[formData.city]?.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <Button onClick={handleStep1Next} className="w-full gap-2">
              İleri
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Adım 2: Email + Telefon */}
        {step === 2 && (
          <div className="space-y-4">
            {userExists && (
              <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                <p className="mb-2 text-sm font-medium text-yellow-900">
                  ⚠️ Bu bilgilerle kayıtlı kullanıcı bulundu
                </p>
                <p className="text-sm text-yellow-800">
                  Zaten bir hesabınız var. Lütfen giriş yapın veya farklı bilgiler kullanın.
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="mt-3 text-sm font-medium text-yellow-900 underline hover:text-yellow-950"
                >
                  Giriş Yap →
                </button>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium">
                E-posta <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ornek@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Telefon <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0555 123 4567"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Geri
              </Button>
              <Button 
                onClick={handleStep2Next} 
                disabled={loading} 
                className="flex-1 gap-2"
              >
                {loading ? "Kontrol ediliyor..." : "İleri"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Adım 3: Şifre + Şifre Onayı */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Şifre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="En az 6 karakter"
                  className="pl-10"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Şifre Onayı <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  placeholder="Şifrenizi tekrar girin"
                  className="pl-10"
                  minLength={6}
                  required
                />
              </div>
              {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                <p className="mt-1 text-xs text-red-600">Şifreler eşleşmiyor</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setStep(2)} 
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Geri
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.password || !formData.passwordConfirm || formData.password !== formData.passwordConfirm} 
                className="flex-1"
              >
                {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              </Button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Zaten hesabınız var mı?{" "}
          <a href="/login" className="font-medium text-sky-600 hover:text-sky-700">
            Giriş Yap
          </a>
        </p>

        <div className="mt-4 border-t pt-4">
          <p className="text-center text-sm text-gray-600">
            Hizmet vermek mi istiyorsunuz?
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-2 w-full"
            onClick={() => router.push("/provider/register")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Hizmet Veren Olarak Kayıt Ol
          </Button>
        </div>
      </div>
    </div>
  );
}
