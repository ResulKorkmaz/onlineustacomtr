"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CITIES, DISTRICTS, SERVICE_CATEGORIES } from "@/lib/constants";
import { ArrowLeft, Save, AlertCircle, Check } from "lucide-react";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  city: string;
  district: string;
  budget_min: number;
  budget_max: number;
  job_date?: string;
  job_time?: string;
  only_price_research: boolean;
}

interface Props {
  job: Job;
}

export default function JobEditClient({ job }: Props) {
  const [formData, setFormData] = useState({
    title: job.title,
    description: job.description,
    category: job.category,
    city: job.city,
    district: job.district,
    budget_min: job.budget_min.toString(),
    budget_max: job.budget_max.toString(),
    job_date: job.job_date || "",
    job_time: job.job_time || "",
    only_price_research: job.only_price_research,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasyon
      if (!formData.title.trim()) {
        setError("İlan başlığı zorunludur");
        return;
      }

      if (formData.description.trim().length < 90) {
        setError("İş açıklaması en az 90 karakter olmalıdır");
        return;
      }

      if (!formData.category) {
        setError("Kategori seçimi zorunludur");
        return;
      }

      if (!formData.city || !formData.district) {
        setError("Şehir ve ilçe seçimi zorunludur");
        return;
      }

      const budgetMin = parseFloat(formData.budget_min);
      const budgetMax = parseFloat(formData.budget_max);

      if (isNaN(budgetMin) || isNaN(budgetMax) || budgetMin <= 0 || budgetMax <= 0) {
        setError("Geçerli bütçe değerleri girin");
        return;
      }

      if (budgetMin > budgetMax) {
        setError("Minimum bütçe, maksimum bütçeden büyük olamaz");
        return;
      }

      // Güncelle
      const { error: updateError } = await supabase
        .from("jobs")
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          city: formData.city,
          district: formData.district,
          budget_min: budgetMin,
          budget_max: budgetMax,
          job_date: formData.job_date || null,
          job_time: formData.job_time || null,
          only_price_research: formData.only_price_research,
        })
        .eq("id", job.id);

      if (updateError) throw updateError;

      setSuccess(true);
      
      // 2 saniye sonra ilan detayına yönlendir
      setTimeout(() => {
        router.push(`/jobs/${job.id}`);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "İlan güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  // Başarı mesajı gösteriliyorsa
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Check className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
            İlan Güncellendi! 🎉
          </h2>
          <p className="mb-6 text-center text-gray-600">
            İlanınız başarıyla güncellendi.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-sky-600"></div>
            <span>İlan detaylarına yönlendiriliyorsunuz...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/jobs/${job.id}`}
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              İlan Detayına Dön
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">İlanı Düzenle</h1>
            <p className="mt-2 text-gray-600">
              İlan bilgilerini güncelleyin
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* İlan Başlığı */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">İlan Başlığı</h2>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Örn: Elektrik arızası var"
                className="text-base"
              />
            </div>

            {/* Kategori */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Kategori</h2>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="text-base"
              >
                <option value="">Kategori seçin</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* İş Açıklaması */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">İş Açıklaması</h2>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                placeholder="İşi detaylı bir şekilde açıklayın..."
                className="resize-none text-base"
              />
              <p className="mt-2 text-sm text-gray-500">
                {formData.description.length}/90 karakter (minimum)
              </p>
            </div>

            {/* Konum */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Konum</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Şehir</label>
                  <Select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value, district: "" })}
                    className="text-base"
                  >
                    <option value="">Şehir seçin</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">İlçe</label>
                  <Select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="text-base"
                    disabled={!formData.city}
                  >
                    <option value="">İlçe seçin</option>
                    {formData.city && DISTRICTS[formData.city]?.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Tarih ve Saat */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Tarih ve Saat (Opsiyonel)</h2>
              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Tarih</label>
                  <Input
                    type="date"
                    value={formData.job_date}
                    onChange={(e) => setFormData({ ...formData, job_date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="text-base"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Saat</label>
                  <Input
                    type="time"
                    value={formData.job_time}
                    onChange={(e) => setFormData({ ...formData, job_time: e.target.value })}
                    className="text-base"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.only_price_research}
                  onChange={(e) => setFormData({ ...formData, only_price_research: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm text-gray-700">Sadece fiyat araştırıyorum</span>
              </label>
            </div>

            {/* Bütçe */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Bütçe</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Minimum Bütçe (₺)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">₺</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.budget_min}
                      onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                      placeholder="1000"
                      className="pl-8 text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Maksimum Bütçe (₺)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">₺</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.budget_max}
                      onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                      placeholder="5000"
                      className="pl-8 text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-sky-600 py-6 text-lg font-semibold hover:bg-sky-700"
              >
                <Save className="mr-2 h-5 w-5" />
                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
              
              <Link href={`/jobs/${job.id}`} className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6 text-lg font-semibold"
                >
                  İptal
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

