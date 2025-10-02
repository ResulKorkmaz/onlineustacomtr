"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CITIES, DISTRICTS, SERVICE_CATEGORIES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, ChevronLeft, Check, Calendar } from "lucide-react";

export default function NewJobPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    city: "",
    district: "",
    job_date: "",
    job_time: "",
    only_price_research: false,
    budget_min: "",
    budget_max: "",
  });

  const [categorySearch, setSearchSearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const filteredCategories = SERVICE_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleNext = () => {
    setError("");

    if (currentStep === 1) {
      if (!formData.title.trim()) {
        setError("İlan başlığı zorunludur");
        return;
      }
      if (!formData.category) {
        setError("Kategori seçimi zorunludur");
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.description.trim()) {
        setError("İş açıklaması zorunludur");
        return;
      }
      if (formData.description.trim().length < 90) {
        setError("İş açıklaması en az 90 karakter olmalıdır");
        return;
      }
    }

    if (currentStep === 3) {
      if (!formData.city) {
        setError("İl seçimi zorunludur");
        return;
      }
      if (!formData.district) {
        setError("İlçe seçimi zorunludur");
        return;
      }
    }

    if (currentStep === 4) {
      if (!formData.job_date) {
        setError("İş tarihi zorunludur");
        return;
      }
      if (!formData.job_time) {
        setError("İş saati zorunludur");
        return;
      }
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    setError("");

    // Son adım validasyonu
    if (!formData.budget_min || !formData.budget_max) {
      setError("Minimum ve maksimum bütçe zorunludur");
      return;
    }

    if (parseFloat(formData.budget_min) <= 0 || parseFloat(formData.budget_max) <= 0) {
      setError("Bütçe değerleri 0'dan büyük olmalıdır");
      return;
    }

    if (parseFloat(formData.budget_min) > parseFloat(formData.budget_max)) {
      setError("Minimum bütçe, maksimum bütçeden büyük olamaz");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error: submitError } = await supabase
      .from("jobs")
      .insert({
        customer_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        city: formData.city,
        district: formData.district,
        job_date: formData.job_date,
        job_time: formData.job_time,
        only_price_research: formData.only_price_research,
        budget_min: parseFloat(formData.budget_min),
        budget_max: parseFloat(formData.budget_max),
        status: "open",
      })
      .select()
      .single();

    if (submitError) {
      if (submitError.message.includes("günlük") || submitError.message.includes("gün")) {
        setError(submitError.message);
      } else if (submitError.message.includes("limit")) {
        setError(submitError.message);
      } else {
        setError("İlan oluşturulamadı. Lütfen tekrar deneyin.");
      }
      console.error("[JobCreate] Error:", submitError);
      setLoading(false);
    } else if (data) {
      router.push(`/jobs/${data.id}`);
    }
  };

  const steps = [
    { number: 1, title: "Başlık & Kategori" },
    { number: 2, title: "İş Detayları" },
    { number: 3, title: "Konum" },
    { number: 4, title: "Tarih & Saat" },
    { number: 5, title: "Bütçe" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Yeni İlan Oluştur</h1>
            <p className="mt-2 text-gray-600">İhtiyacınızı 5 adımda kolayca paylaşın</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                      currentStep >= step.number
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 hidden text-xs sm:block ${
                      currentStep >= step.number ? "text-sky-600 font-medium" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 transition ${
                      currentStep > step.number ? "bg-sky-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            {/* Step 1: Başlık & Kategori */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">İlan Başlığı ve Kategori</h2>
                  <p className="mb-4 text-sm text-gray-600">
                    İhtiyacınızı kısaca özetleyin ve uygun kategoriyi seçin
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    İlan Başlığı <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: Evde elektrik tesisatı yenilemesi"
                    className="text-base"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        value={categorySearch}
                        onChange={(e) => {
                          setSearchSearch(e.target.value);
                          setShowCategoryDropdown(true);
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                        placeholder="Kategori ara veya seç..."
                        className="pl-10 text-base"
                      />
                    </div>

                    {/* Selected Category */}
                    {formData.category && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-sky-100 px-3 py-2 text-sm font-medium text-sky-700">
                          {SERVICE_CATEGORIES.find(c => c.name === formData.category)?.icon} {formData.category}
                          <button
                            onClick={() => setFormData({ ...formData, category: "" })}
                            className="text-sky-600 hover:text-sky-800"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Category Dropdown */}
                    {showCategoryDropdown && !formData.category && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowCategoryDropdown(false)}
                        />
                        <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                          {filteredCategories.length > 0 ? (
                            <>
                              {filteredCategories.map((cat) => (
                                <button
                                  key={cat.id}
                                  onClick={() => {
                                    setFormData({ ...formData, category: cat.name });
                                    setShowCategoryDropdown(false);
                                    setSearchSearch("");
                                  }}
                                  className="block w-full px-4 py-3 text-left hover:bg-sky-50 transition"
                                >
                                  {cat.icon} {cat.name}
                                </button>
                              ))}
                              <button
                                onClick={() => setShowCategoryDropdown(false)}
                                className="sticky bottom-0 w-full bg-sky-600 px-4 py-3 text-center text-white hover:bg-sky-700 transition"
                              >
                                Listeyi Kapat
                              </button>
                            </>
                          ) : (
                            <div className="px-4 py-3 text-center text-gray-500">
                              Kategori bulunamadı
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: İş Detayları */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">İşin Detayları</h2>
                  <p className="mb-4 text-sm text-gray-600">
                    İşin ne olduğunu detaylıca açıklayın (en az 90 karakter)
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    İş Açıklaması <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="İşin detaylarını, beklentilerinizi ve özel taleplerinizi yazın..."
                    rows={8}
                    className="text-base"
                  />
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className={formData.description.length < 90 ? "text-red-500" : "text-green-600"}>
                      {formData.description.length} / 90 karakter
                    </span>
                    <span className="text-gray-500">
                      Kalan: {Math.max(0, 90 - formData.description.length)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Konum */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">İş Konumu</h2>
                  <p className="mb-4 text-sm text-gray-600">
                    İşin yapılacağı il ve ilçeyi seçin
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    İl <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value, district: "" })}
                    className="text-base"
                  >
                    <option value="">İl seçin</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                </div>

                {formData.city && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      İlçe <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="text-base"
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
              </div>
            )}

            {/* Step 4: Tarih & Saat */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">İş Tarihi ve Saati</h2>
                  <p className="mb-4 text-sm text-gray-600">
                    İşin ne zaman yapılmasını istediğinizi belirtin
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    İş Tarihi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.job_date}
                      onChange={(e) => setFormData({ ...formData, job_date: e.target.value })}
                      className="pl-10 text-base"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    İş Saati <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="time"
                    value={formData.job_time}
                    onChange={(e) => setFormData({ ...formData, job_time: e.target.value })}
                    className="text-base"
                  />
                </div>

                {/* Price Research Checkbox */}
                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.only_price_research}
                      onChange={(e) => setFormData({ ...formData, only_price_research: e.target.checked })}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Sadece Fiyat Araştırıyorum</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Henüz kesin karar vermedim, sadece fiyat teklifi almak istiyorum
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Bütçe */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">Bütçe Aralığı</h2>
                  <p className="mb-4 text-sm text-gray-600">
                    İş için ayırdığınız minimum ve maksimum bütçeyi belirtin
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Minimum Bütçe (₺) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">₺</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.budget_min}
                        onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                        placeholder="1000"
                        className="pl-10 text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Maksimum Bütçe (₺) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">₺</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.budget_max}
                        onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                        placeholder="5000"
                        className="pl-10 text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget Preview */}
                {formData.budget_min && formData.budget_max && (
                  <div className="rounded-lg bg-sky-50 p-4">
                    <p className="text-sm text-sky-900">
                      <strong>Bütçe Aralığınız:</strong> {parseFloat(formData.budget_min).toLocaleString('tr-TR')} ₺ - {parseFloat(formData.budget_max).toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                disabled={currentStep === 1 || loading}
                className="flex-1 sm:flex-none"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Geri
              </Button>

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 sm:flex-none"
                >
                  İleri
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 sm:flex-none"
                >
                  {loading ? "Yayınlanıyor..." : "İlanı Yayınla"}
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <strong>Bilgilendirme:</strong> İlanınız yayınlandıktan sonra hizmet verenlere görünür olacak ve teklif almaya başlayacaksınız.
          </div>
        </div>
      </div>
    </div>
  );
}
