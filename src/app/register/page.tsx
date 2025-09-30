"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SERVICE_CATEGORIES, CITIES, DISTRICTS } from "@/lib/constants";
import { Check, ChevronRight, ChevronLeft, Upload, AlertCircle } from "lucide-react";

type ProviderKind = "individual" | "company" | "";
type FormData = {
  kind: ProviderKind;
  categories: string[];
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  district: string;
  bio: string;
  expertise: string;
  companyName?: string;
  taxId?: string;
  documentFile?: File | null;
  kvkkAccepted: boolean;
};

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState<FormData>({
    kind: "",
    categories: [],
    fullName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    district: "",
    bio: "",
    expertise: "",
    companyName: "",
    taxId: "",
    documentFile: null,
    kvkkAccepted: false,
  });

  const totalSteps = 5;

  // Email/telefon kontrolü
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
        setError(data.message || "Bu bilgiler ile kayıtlı kullanıcı bulundu");
      } else {
        setError("");
      }
    } catch (err) {
      console.error("Check user error:", err);
    }
  };

  useEffect(() => {
    if (step === 3 && (formData.email || formData.phone)) {
      const timer = setTimeout(() => {
        checkUserExists();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.email, formData.phone, step]);

  const handleNext = () => {
    setError("");
    
    // Adım validasyonları
    if (step === 1 && !formData.kind) {
      setError("Lütfen bir seçim yapın");
      return;
    }

    if (step === 2 && formData.kind === "individual" && formData.categories.length === 0) {
      setError("Lütfen en az 1 kategori seçin");
      return;
    }

    if (step === 3) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
        setError("Lütfen tüm alanları doldurun");
        return;
      }
      if (formData.password.length < 6) {
        setError("Şifre en az 6 karakter olmalıdır");
        return;
      }
      if (userExists) {
        return; // Kullanıcı varsa ilerletme
      }
    }

    if (step === 4 && (!formData.city || !formData.district)) {
      setError("Lütfen il ve ilçe seçin");
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const toggleCategory = (categoryId: string) => {
    const current = formData.categories;
    if (current.includes(categoryId)) {
      setFormData({ ...formData, categories: current.filter(c => c !== categoryId) });
    } else {
      if (current.length < 3) {
        setFormData({ ...formData, categories: [...current, categoryId] });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Dosya boyutu 5MB'dan küçük olmalıdır");
        return;
      }
      setFormData({ ...formData, documentFile: file });
    }
  };

  const handleSubmit = async () => {
    if (!formData.kvkkAccepted) {
      setError("Lütfen kişisel verilerin korunması onayını kabul edin");
      return;
    }

    if (formData.kind === "company" && !formData.documentFile) {
      setError("Lütfen belge yükleyin");
      return;
    }

    if (!formData.bio || formData.bio.length < 50) {
      setError("Lütfen en az 50 karakter tanıtım metni girin");
      return;
    }

    setLoading(true);
    setError("");

    try {
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

      if (authError) throw authError;
      if (!authData.user) throw new Error("Kullanıcı oluşturulamadı");

      // 2. Belge yükleme (şirket ise)
      let documentUrl = null;
      if (formData.kind === "company" && formData.documentFile) {
        const fileExt = formData.documentFile.name.split(".").pop();
        const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(`company-docs/${fileName}`, formData.documentFile);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("documents")
            .getPublicUrl(`company-docs/${fileName}`);
          documentUrl = urlData.publicUrl;
        }
      }

      // 3. Profil oluşturma
      const profileData = {
        id: authData.user.id,
        role: "provider" as const,
        provider_kind: formData.kind,
        full_name: formData.fullName,
        company_name: formData.kind === "company" ? formData.companyName : null,
        tax_id: formData.kind === "company" ? formData.taxId : null,
        phone: formData.phone,
        bio: formData.bio,
        city: formData.city,
        district: formData.district,
        is_verified: false,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData);

      if (profileError) throw profileError;

      // 4. Kategorileri kaydet (şahıs ise)
      if (formData.kind === "individual" && formData.categories.length > 0) {
        // Kategori kaydetme işlemi - şimdilik expertise alanına kaydediyoruz
        await supabase
          .from("profiles")
          .update({ 
            bio: `${formData.bio}\n\nUzmanlık Alanları: ${formData.expertise}\n\nHizmet Kategorileri: ${formData.categories.map(c => 
              SERVICE_CATEGORIES.find(cat => cat.id === c)?.name
            ).join(", ")}`
          })
          .eq("id", authData.user.id);
      }

      // 5. Başarılı - profil sayfasına yönlendir
      if (formData.kind === "company") {
        router.push("/dashboard/profile/company");
      } else {
        router.push("/dashboard/profile/individual");
      }

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Kayıt sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition ${
                      s < step
                        ? "border-sky-500 bg-sky-500 text-white"
                        : s === step
                        ? "border-sky-500 bg-white text-sky-500"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {s < step ? <Check className="h-5 w-5" /> : s}
                  </div>
                  {s < 5 && (
                    <div
                      className={`h-1 w-12 transition sm:w-24 ${
                        s < step ? "bg-sky-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              Adım {step} / {totalSteps}
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border bg-white p-8 shadow-lg">
            {/* Step 1: Tip Seçimi */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">Kayıt Tipini Seçin</h2>
                  <p className="text-gray-600">Şahıs mı, şirket mi olarak kayıt olmak istiyorsunuz?</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, kind: "individual" })}
                    className={`rounded-xl border-2 p-6 text-left transition ${
                      formData.kind === "individual"
                        ? "border-sky-500 bg-sky-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="mb-3 text-4xl">👨‍🔧</div>
                    <h3 className="mb-2 text-lg font-semibold">Şahıs</h3>
                    <p className="text-sm text-gray-600">
                      Bireysel olarak hizmet veriyorum
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, kind: "company" })}
                    className={`rounded-xl border-2 p-6 text-left transition ${
                      formData.kind === "company"
                        ? "border-sky-500 bg-sky-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="mb-3 text-4xl">🏢</div>
                    <h3 className="mb-2 text-lg font-semibold">Şirket</h3>
                    <p className="text-sm text-gray-600">
                      Şirket olarak hizmet veriyorum
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Kategori Seçimi (sadece şahıslar için) */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">Hizmet Kategorileri</h2>
                  <p className="text-gray-600">
                    {formData.kind === "individual"
                      ? "Hangi kategorilerde hizmet veriyorsunuz? (En fazla 3 kategori seçebilirsiniz)"
                      : "Şirketler için kategori seçimi sonraki adımlarda yapılacaktır"}
                  </p>
                </div>

                {formData.kind === "individual" ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SERVICE_CATEGORIES.map((category) => {
                      const isSelected = formData.categories.includes(category.id);
                      const isDisabled = !isSelected && formData.categories.length >= 3;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          disabled={isDisabled}
                          className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition ${
                            isSelected
                              ? "border-sky-500 bg-sky-50"
                              : isDisabled
                              ? "border-gray-200 bg-gray-50 opacity-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                          {isSelected && <Check className="ml-auto h-5 w-5 text-sky-500" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg bg-blue-50 p-6 text-center">
                    <p className="text-blue-900">
                      Şirket kaydı için kategori seçimi zorunlu değildir.
                      Profilinizde istediğiniz kategorileri belirtebilirsiniz.
                    </p>
                  </div>
                )}

                {formData.kind === "individual" && (
                  <p className="text-sm text-gray-600">
                    Seçilen: {formData.categories.length} / 3
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Kişisel Bilgiler */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">Kişisel Bilgiler</h2>
                  <p className="text-gray-600">İletişim bilgilerinizi girin</p>
                </div>

                {formData.kind === "company" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Şirket Adı</label>
                      <Input
                        placeholder="Şirket Adı"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Vergi Numarası</label>
                      <Input
                        placeholder="Vergi Numarası"
                        value={formData.taxId}
                        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium">Ad Soyad</label>
                  <Input
                    placeholder="Ad Soyad"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">E-posta</label>
                  <Input
                    type="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Telefon</label>
                  <Input
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Şifre</label>
                  <Input
                    type="password"
                    placeholder="En az 6 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                {userExists && (
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <p className="mb-3 text-sm text-yellow-900">
                      Bu bilgilerle kayıtlı bir hesap bulundu
                    </p>
                    <Button
                      onClick={() => router.push("/login")}
                      variant="outline"
                      size="sm"
                    >
                      Giriş Sayfasına Git
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Konum */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">Konum Bilgileri</h2>
                  <p className="text-gray-600">Hizmet vereceğiniz bölgeyi belirtin</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">İl</label>
                  <Select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value, district: "" })}
                  >
                    <option value="">İl Seçin</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                </div>

                {formData.city && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">İlçe</label>
                    <Select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                      <option value="">İlçe Seçin</option>
                      <option value="Merkez">Merkez</option>
                      {DISTRICTS[formData.city] && DISTRICTS[formData.city].filter(d => d !== "Merkez").map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </Select>
                    {formData.city && !DISTRICTS[formData.city]?.length && (
                      <p className="mt-2 text-xs text-gray-500">
                        Bu il için detaylı ilçe listesi henüz eklenmemiş, "Merkez" seçebilirsiniz.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Tanıtım ve Onay */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">Tanıtım ve Onay</h2>
                  <p className="text-gray-600">Kendinizi ve hizmetlerinizi tanıtın</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Kendinizi Tanıtın (En az 50 karakter)
                  </label>
                  <Textarea
                    placeholder="Deneyimleriniz, çalışma şekliniz hakkında bilgi verin..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={5}
                  />
                  <p className="mt-1 text-xs text-gray-500">{formData.bio.length} / 50 karakter</p>
                </div>

                {formData.kind === "individual" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">Uzmanlık Alanları</label>
                    <Textarea
                      placeholder="Örn: 10 yıllık elektrik tesisatı deneyimi, akıllı ev sistemleri..."
                      value={formData.expertise}
                      onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                      rows={3}
                    />
                  </div>
                )}

                {formData.kind === "company" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Belediye Ruhsatı veya Fatura Yükleyin (PDF, JPG, PNG - Max 5MB)
                    </label>
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-sky-400">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="document-upload"
                      />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <Upload className="mx-auto mb-2 h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {formData.documentFile
                            ? formData.documentFile.name
                            : "Belge yüklemek için tıklayın"}
                        </p>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Şirket kaydınızın onaylanması için gereklidir
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.kvkkAccepted}
                      onChange={(e) => setFormData({ ...formData, kvkkAccepted: e.target.checked })}
                      className="mt-1 h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">
                      Kişisel verilerimin işlenmesine ve{" "}
                      <a href="/privacy" className="text-sky-600 hover:underline">
                        KVKK aydınlatma metnini
                      </a>{" "}
                      okuduğumu kabul ediyorum.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                onClick={handleBack}
                variant="ghost"
                disabled={step === 1 || loading}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Geri
              </Button>

              {step < totalSteps ? (
                <Button onClick={handleNext} disabled={loading} className="gap-2">
                  İleri
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading || !formData.kvkkAccepted}>
                  {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                </Button>
              )}
            </div>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <a href="/login" className="font-medium text-sky-600 hover:underline">
              Giriş Yap
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

