"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Tag, 
  MessageCircle, 
  TrendingUp,
  MoreVertical,
  Edit,
  PauseCircle,
  Trash2,
  Eye,
  X,
  AlertCircle,
  User
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  city: string;
  district: string;
  budget_min: number;
  budget_max: number;
  status: string;
  bid_count: number;
  created_at: string;
  job_date?: string;
  job_time?: string;
  customer?: {
    full_name: string;
    city: string;
    district: string;
  };
}

interface Bid {
  id: string;
  amount: number;
  message: string;
  status: string;
  created_at: string;
  provider: {
    full_name: string;
    phone?: string;
  };
}

interface Props {
  jobs: Job[];
  isProvider: boolean;
  city?: string;
}

export default function DashboardJobsClient({ jobs, isProvider, city }: Props) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [viewingBidsFor, setViewingBidsFor] = useState<Job | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  // Dropdown menu toggle
  const toggleMenu = (jobId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === jobId ? null : jobId);
  };

  // Teklifleri yükle
  const loadBids = async (job: Job) => {
    setViewingBidsFor(job);
    setLoadingBids(true);
    setError("");

    try {
      console.log("[loadBids] Loading bids for job:", job.id);
      
      const { data, error: bidsError } = await supabase
        .from("bids")
        .select(`
          *,
          provider:profiles(full_name, phone)
        `)
        .eq("job_id", job.id)
        .order("created_at", { ascending: false });

      console.log("[loadBids] Bids data:", data);
      console.log("[loadBids] Bids error:", bidsError);

      if (bidsError) {
        console.error("[loadBids] Error loading bids:", bidsError);
        throw bidsError;
      }
      
      setBids(data || []);
    } catch (err) {
      console.error("[loadBids] Catch error:", err);
      setError(err instanceof Error ? err.message : "Teklifler yüklenemedi");
    } finally {
      setLoadingBids(false);
    }
  };

  // İlanı pasife al/aktifleştir
  const toggleJobStatus = async (job: Job, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError("");

    try {
      const newStatus = job.status === "open" ? "closed" : "open";

      const { error: updateError } = await supabase
        .from("jobs")
        .update({ status: newStatus })
        .eq("id", job.id);

      if (updateError) throw updateError;

      router.refresh();
      setOpenMenuId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "İlan güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  // İlanı sil
  const deleteJob = async () => {
    if (!deletingJobId) return;

    setLoading(true);
    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("jobs")
        .delete()
        .eq("id", deletingJobId);

      if (deleteError) throw deleteError;

      router.refresh();
      setDeletingJobId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "İlan silinemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isProvider ? "İş İlanları" : "İlanlarım"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isProvider 
            ? `${city} ilindeki aktif iş ilanları` 
            : "Yayınladığınız iş ilanları"}
        </p>
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

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MessageCircle className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-900">
            {isProvider 
              ? `${city} ilinde henüz aktif ilan bulunmuyor` 
              : "Henüz ilan oluşturmadınız"}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {isProvider
              ? "Yeni ilanlar geldiğinde burada görünecek"
              : "İlk ilanınızı oluşturun ve teklifler almaya başlayın"}
          </p>
          {!isProvider && (
            <Link
              href="/jobs/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition hover:bg-sky-700"
            >
              <TrendingUp className="h-5 w-5" />
              İlk İlanınızı Oluşturun
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group relative overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg"
            >
              {/* Status Bar */}
              <div className="border-b bg-gradient-to-r from-gray-50 to-white px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      job.status === "open" 
                        ? "bg-green-100 text-green-700" 
                        : job.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${
                        job.status === "open" ? "bg-green-500 animate-pulse" : "bg-gray-400"
                      }`} />
                      {job.status === "open" ? "Açık" : job.status === "in_progress" ? "Devam Ediyor" : "Kapalı"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(job.created_at)}
                    </span>
                    
                    {/* Müşteri için: İlanı Yönet Butonu */}
                    {!isProvider && (
                      <div className="relative">
                        <button
                          onClick={(e) => toggleMenu(job.id, e)}
                          className="rounded-lg p-2 hover:bg-gray-100 transition"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === job.id && (
                          <>
                            {/* Backdrop */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            
                            {/* Menu */}
                            <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border bg-white shadow-lg">
                              <button
                                onClick={() => router.push(`/jobs/${job.id}/edit`)}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                              >
                                <Edit className="h-4 w-4" />
                                Düzenle
                              </button>

                              <button
                                onClick={(e) => toggleJobStatus(job, e)}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                                disabled={loading}
                              >
                                <PauseCircle className="h-4 w-4" />
                                {job.status === "open" ? "Pasife Al" : "Aktifleştir"}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDeletingJobId(job.id);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 border-t px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition"
                              >
                                <Trash2 className="h-4 w-4" />
                                Sil
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <Link href={`/jobs/${job.id}`} className="block p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 transition group-hover:text-sky-600">
                      {job.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-gray-600">
                      {job.description}
                    </p>

                    {/* Info Cards */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Kategori */}
                      {job.category && (
                        <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2">
                          <Tag className="h-4 w-4 flex-shrink-0 text-purple-600" />
                          <span className="truncate text-sm font-medium text-purple-900">{job.category}</span>
                        </div>
                      )}

                      {/* Konum */}
                      <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-blue-600" />
                        <span className="truncate text-sm font-medium text-blue-900">
                          {job.city}{job.district && `, ${job.district}`}
                        </span>
                      </div>

                      {/* Bütçe */}
                      {job.budget_min && (
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                          <DollarSign className="h-4 w-4 flex-shrink-0 text-green-600" />
                          <span className="truncate text-sm font-medium text-green-900">
                            ₺{job.budget_min.toLocaleString()}-₺{job.budget_max.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Tarih */}
                      {job.job_date && (
                        <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2">
                          <Calendar className="h-4 w-4 flex-shrink-0 text-orange-600" />
                          <span className="truncate text-sm font-medium text-orange-900">
                            {new Date(job.job_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                            {job.job_time && ` ${job.job_time}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Provider için: Müşteri bilgisi */}
                    {isProvider && job.customer && (
                      <div className="mt-4 rounded-lg border bg-gray-50 px-4 py-3">
                        <p className="text-sm text-gray-600">
                          İlan Veren: <span className="font-semibold text-gray-900">{job.customer.full_name}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Teklif Sayısı - Müşteri için büyük göster */}
                  {!isProvider && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        loadBids(job);
                      }}
                      className="flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100 px-6 py-4 transition hover:shadow-md"
                    >
                      <MessageCircle className="h-6 w-6 text-sky-600" />
                      <div className="text-center">
                        <p className="text-3xl font-bold text-sky-700">{job.bid_count}</p>
                        <p className="text-xs text-gray-600">Teklif</p>
                      </div>
                      <span className="text-xs text-sky-600 hover:underline">Görüntüle</span>
                    </button>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Teklifler Modal */}
      {viewingBidsFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b bg-white px-8 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gelen Teklifler</h2>
                  <p className="mt-1 text-sm text-gray-600">{viewingBidsFor.title}</p>
                </div>
                <button
                  onClick={() => setViewingBidsFor(null)}
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {error ? (
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-12 text-center">
                  <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                  <p className="font-medium text-red-900">Teklifler yüklenemedi</p>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                  <button
                    onClick={() => loadBids(viewingBidsFor)}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Tekrar Dene
                  </button>
                </div>
              ) : loadingBids ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
                  <p className="text-gray-600">Teklifler yükleniyor...</p>
                </div>
              ) : bids.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                  <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-xl font-medium text-gray-900">Henüz teklif gelmedi</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Ustalar ilanınızı görüntülediğinde buradan teklifleri görebileceksiniz
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="rounded-xl border bg-gradient-to-r from-gray-50 to-white p-6 transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sky-100">
                            <User className="h-6 w-6 text-sky-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="mb-3 flex items-center gap-3">
                              <p className="font-semibold text-gray-900">{bid.provider.full_name}</p>
                              {bid.provider.phone && (
                                <a
                                  href={`tel:${bid.provider.phone}`}
                                  className="text-sm text-sky-600 hover:underline"
                                >
                                  {bid.provider.phone}
                                </a>
                              )}
                            </div>
                            
                            <div className="rounded-lg border bg-white p-4">
                              <p className="text-gray-700">{bid.message}</p>
                            </div>
                            
                            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                              <span className={`rounded-full px-2 py-1 ${
                                bid.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : bid.status === "accepted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {bid.status === "pending" ? "Beklemede" : bid.status === "accepted" ? "Kabul Edildi" : "Reddedildi"}
                              </span>
                              <span>{formatRelativeTime(bid.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-sky-600">
                            ₺{bid.amount.toLocaleString('tr-TR')}
                          </p>
                          <p className="text-xs text-gray-500">Teklif</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modal */}
      {deletingJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h2 className="mb-3 text-center text-2xl font-bold text-gray-900">
              İlanı Sil
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Bu ilanı silmek istediğinizden emin misiniz? Tüm teklifler de silinecektir. Bu işlem geri alınamaz.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={deleteJob}
                disabled={loading}
                className="flex-1 bg-red-600 py-3 hover:bg-red-700"
              >
                {loading ? "Siliniyor..." : "Evet, Sil"}
              </Button>
              <Button
                onClick={() => setDeletingJobId(null)}
                variant="outline"
                className="flex-1 py-3"
              >
                İptal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
