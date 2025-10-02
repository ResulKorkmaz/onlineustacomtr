import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, MessageSquare, TrendingUp, Plus } from "lucide-react";

export const revalidate = 30; // 30 saniyede bir güncelle

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Provider ise direkt dashboard ilanlar sayfasına yönlendir
  if (profile?.role === "provider") {
    redirect("/dashboard/jobs");
  }

  // Customer için istatistikler
  const { count: jobsCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", user.id);

  // Müşterinin ilanlarına gelen teklif sayısı
  // Önce müşterinin job ID'lerini al
  const { data: userJobs } = await supabase
    .from("jobs")
    .select("id")
    .eq("customer_id", user.id);

  const jobIds = userJobs?.map(job => job.id) || [];

  // Sonra bu job'lara gelen teklifleri say
  const { count: bidsCount } = await supabase
    .from("bids")
    .select("*", { count: "exact", head: true })
    .in("job_id", jobIds.length > 0 ? jobIds : ['00000000-0000-0000-0000-000000000000']);

  // Aktif (açık) ilanlar
  const { count: activeJobsCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", user.id)
    .eq("status", "open");

  return (
    <div className="space-y-8">
      {/* Hoş Geldin Kartı */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Hoş Geldiniz, {profile?.full_name || 'Kullanıcı'}! 👋</h1>
          <p className="mt-2 text-sky-100">
            İlanlarınızı yönetin ve teklifleri inceleyin
          </p>
        </div>
        {/* Dekoratif Daireler */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/5"></div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Toplam İlanlar */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam İlanlarım</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{jobsCount || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/jobs" 
              className="text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              İlanları Görüntüle →
            </Link>
          </div>
        </div>

        {/* Aktif İlanlar */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Aktif İlanlar</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{activeJobsCount || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Şu anda açık ilanlarınız</p>
          </div>
        </div>

        {/* Gelen Teklifler */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Gelen Teklifler</p>
              <p className="mt-2 text-3xl font-bold text-orange-600">{bidsCount || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/bids" 
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              Teklifleri İncele →
            </Link>
          </div>
        </div>
      </div>

      {/* Hızlı Aksiyonlar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Hızlı Aksiyonlar</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link 
            href="/jobs/new"
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-sky-300 hover:bg-sky-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Yeni İlan Oluştur</h3>
              <p className="text-sm text-gray-500">İhtiyacınızı paylaşın</p>
            </div>
          </Link>

          <Link 
            href="/dashboard/jobs"
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-sky-300 hover:bg-sky-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">İlanlarımı Yönet</h3>
              <p className="text-sm text-gray-500">Tüm ilanlarınızı görün</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
