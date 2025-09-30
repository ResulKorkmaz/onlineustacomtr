"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CITIES, LIMITS } from "@/lib/constants";
import { useRouter } from "next/navigation";

const schema = z.object({
  title: z.string().min(LIMITS.JOB_TITLE_MIN).max(LIMITS.JOB_TITLE_MAX),
  description: z.string().min(LIMITS.JOB_DESCRIPTION_MIN).max(LIMITS.JOB_DESCRIPTION_MAX),
  city: z.string().min(1, "Şehir seçiniz"),
  district: z.string().optional(),
  budget_min: z.coerce.number().optional(),
  budget_max: z.coerce.number().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormData) {
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error: submitError } = await supabase
      .from("jobs")
      .insert({
        customer_id: user.id,
        ...values,
      })
      .select()
      .single();

    if (submitError) {
      setError(submitError.message);
    } else if (data) {
      router.push(`/jobs/${data.id}`);
    }

    setLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Yeni İlan Oluştur</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block font-medium">İlan Başlığı</label>
            <Input
              {...register("title")}
              placeholder="Örn: Evde elektrik tesisatı yenilemesi"
              error={errors.title?.message}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Açıklama</label>
            <Textarea
              {...register("description")}
              placeholder="İşin detaylarını yazın..."
              rows={6}
              error={errors.description?.message}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Şehir</label>
              <Select {...register("city")} error={errors.city?.message}>
                <option value="">Şehir seçin</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-2 block font-medium">İlçe (Opsiyonel)</label>
              <Input {...register("district")} placeholder="İlçe" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Min. Bütçe (TRY)</label>
              <Input
                type="number"
                step="0.01"
                {...register("budget_min")}
                placeholder="1000"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Max. Bütçe (TRY)</label>
              <Input
                type="number"
                step="0.01"
                {...register("budget_max")}
                placeholder="5000"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Yayınlanıyor..." : "İlanı Yayınla"}
          </Button>

          <p className="text-sm text-gray-600">
            <strong>Kurallar:</strong> Günde 1 ilan yayınlayabilirsiniz. 
            Yeni ilan için son ilandan 7 gün beklemeniz gerekir.
          </p>
        </form>
      </div>
    </div>
  );
}
