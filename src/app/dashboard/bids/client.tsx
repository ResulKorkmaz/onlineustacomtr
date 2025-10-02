"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Edit, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  X, 
  Check, 
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  Tag,
  Clock,
  MessageCircle,
  User,
  TrendingUp
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface Bid {
  id: string;
  job_id: number;
  provider_id: string;
  amount: number;
  message: string;
  status: string;
  edit_count: number;
  created_at: string;
  updated_at: string;
  job: {
    id: number;
    title: string;
    description: string;
    city: string;
    district: string;
    budget_min: number;
    budget_max: number;
    status: string;
    category: string;
    job_date?: string;
    job_time?: string;
    customer: {
      full_name: string;
    };
  };
}

interface Props {
  bids: Bid[];
  userId: string;
}

export default function BidsManagementClient({ bids: initialBids, userId }: Props) {
  const [bids, setBids] = useState(initialBids);
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [deletingBidId, setDeletingBidId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [editForm, setEditForm] = useState({
    amount: "",
    message: "",
  });

  const router = useRouter();
  const supabase = createClient();

  // 7 gün kontrolü
  const canEdit = (bid: Bid) => {
    const createdDate = new Date(bid.created_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff < 7 && bid.edit_count < 3 && bid.status === "pending";
  };

  // 7 gün ve düzenleme sayısı bilgisi
  const getEditInfo = (bid: Bid) => {
    const createdDate = new Date(bid.created_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = 7 - daysDiff;
    const remainingEdits = 3 - bid.edit_count;

    if (daysDiff >= 7) return { text: "Düzenleme süresi doldu", color: "text-red-600" };
    if (bid.edit_count >= 3) return { text: "Düzenleme hakkınız bitti", color: "text-red-600" };
    
    return { 
      text: `${remainingDays} gün • ${remainingEdits} düzenleme hakkı kaldı`, 
      color: "text-gray-600" 
    };
  };

  // Düzenleme modal'ını aç
  const handleEditClick = (bid: Bid) => {
    setEditingBid(bid);
    setEditForm({
      amount: bid.amount.toString(),
      message: bid.message,
    });
    setError("");
  };

  // Düzenlemeyi kaydet
  const handleSaveEdit = async () => {
    if (!editingBid) return;

    setLoading(true);
    setError("");

    try {
      const amount = parseFloat(editForm.amount);
      
      if (isNaN(amount) || amount <= 0) {
        setError("Geçerli bir tutar girin");
        return;
      }

      if (!editForm.message.trim()) {
        setError("Mesaj alanı boş olamaz");
        return;
      }

      const { error: updateError } = await supabase
        .from("bids")
        .update({
          amount,
          message: editForm.message,
          edit_count: editingBid.edit_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingBid.id);

      if (updateError) throw updateError;

      // State'i güncelle
      setBids(bids.map(b => 
        b.id === editingBid.id 
          ? { ...b, amount, message: editForm.message, edit_count: b.edit_count + 1, updated_at: new Date().toISOString() }
          : b
      ));

      setEditingBid(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Pasife al / Aktifleştir
  const handleToggleStatus = async (bid: Bid) => {
    setLoading(true);
    setError("");

    try {
      const newStatus = bid.status === "withdrawn" ? "pending" : "withdrawn";

      const { error: updateError } = await supabase
        .from("bids")
        .update({ status: newStatus })
        .eq("id", bid.id);

      if (updateError) throw updateError;

      setBids(bids.map(b => b.id === bid.id ? { ...b, status: newStatus } : b));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Sil
  const handleDelete = async (bidId: string) => {
    setLoading(true);
    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("bids")
        .delete()
        .eq("id", bidId);

      if (deleteError) throw deleteError;

      setBids(bids.filter(b => b.id !== bidId));
      setDeletingBidId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Filtreleme
  const activeBids = bids.filter(b => b.status === "pending");
  const withdrawnBids = bids.filter(b => b.status === "withdrawn");
  const acceptedBids = bids.filter(b => b.status === "accepted");
  const rejectedBids = bids.filter(b => b.status === "rejected");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tekliflerim</h1>
        <p className="mt-2 text-gray-600">
          Verdiğiniz teklifleri yönetin, düzenleyin veya geri çekin
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-gradient-to-br from-sky-50 to-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Teklifler</p>
              <p className="mt-1 text-3xl font-bold text-sky-700">{activeBids.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-sky-600" />
          </div>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-green-50 to-emerald-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kabul Edilen</p>
              <p className="mt-1 text-3xl font-bold text-green-700">{acceptedBids.length}</p>
            </div>
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-orange-50 to-amber-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pasif</p>
              <p className="mt-1 text-3xl font-bold text-orange-700">{withdrawnBids.length}</p>
            </div>
            <PauseCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-red-50 to-rose-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reddedilen</p>
              <p className="mt-1 text-3xl font-bold text-red-700">{rejectedBids.length}</p>
            </div>
            <X className="h-8 w-8 text-red-600" />
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

      {/* Bids List */}
      {bids.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <MessageCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <p className="text-lg font-medium text-gray-900">Henüz teklif vermediniz</p>
          <p className="mt-2 text-sm text-gray-500">
            İş ilanlarına teklif verin ve burada yönetin
          </p>
          <Button 
            onClick={() => router.push("/dashboard/jobs")} 
            className="mt-6"
          >
            İş İlanlarını Görüntüle
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="group overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg"
            >
              {/* Header */}
              <div className="border-b bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      bid.status === "pending"
                        ? "bg-sky-100 text-sky-700"
                        : bid.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : bid.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${
                        bid.status === "pending" ? "bg-sky-500 animate-pulse" : "bg-gray-400"
                      }`} />
                      {bid.status === "pending" 
                        ? "Beklemede" 
                        : bid.status === "accepted" 
                        ? "Kabul Edildi" 
                        : bid.status === "rejected"
                        ? "Reddedildi"
                        : "Pasif"}
                    </span>

                    {bid.edit_count > 0 && (
                      <span className="text-xs text-gray-500">
                        {bid.edit_count} kez düzenlendi
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(bid.created_at)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Job Info */}
                <div className="mb-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {bid.job.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        İlan Veren: <span className="font-medium text-gray-900">{bid.job.customer.full_name}</span>
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-sky-600">
                        ₺{bid.amount.toLocaleString('tr-TR')}
                      </p>
                      <p className="text-xs text-gray-500">Teklifiniz</p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2">
                      <Tag className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">{bid.job.category}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {bid.job.city}, {bid.job.district}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        ₺{bid.job.budget_min.toLocaleString()}-₺{bid.job.budget_max.toLocaleString()}
                      </span>
                    </div>

                    {bid.job.job_date && (
                      <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">
                          {new Date(bid.job.job_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bid Message */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-700">Mesajınız:</p>
                    <p className="mt-1 text-gray-600">{bid.message}</p>
                  </div>
                </div>

                {/* Edit Info */}
                {bid.status === "pending" && (
                  <div className="mb-4 flex items-center gap-2 text-xs">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className={getEditInfo(bid).color}>
                      {getEditInfo(bid).text}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {/* Düzenle */}
                  {canEdit(bid) && (
                    <Button
                      onClick={() => handleEditClick(bid)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Düzenle
                    </Button>
                  )}

                  {/* Pasife Al / Aktifleştir */}
                  {bid.status === "pending" || bid.status === "withdrawn" ? (
                    <Button
                      onClick={() => handleToggleStatus(bid)}
                      variant="outline"
                      size="sm"
                      className={`flex items-center gap-2 ${
                        bid.status === "withdrawn" 
                          ? "border-green-200 text-green-700 hover:bg-green-50"
                          : "border-orange-200 text-orange-700 hover:bg-orange-50"
                      }`}
                      disabled={loading}
                    >
                      {bid.status === "withdrawn" ? (
                        <>
                          <PlayCircle className="h-4 w-4" />
                          Aktifleştir
                        </>
                      ) : (
                        <>
                          <PauseCircle className="h-4 w-4" />
                          Pasife Al
                        </>
                      )}
                    </Button>
                  ) : null}

                  {/* Sil */}
                  {(bid.status === "pending" || bid.status === "withdrawn") && (
                    <Button
                      onClick={() => setDeletingBidId(bid.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </Button>
                  )}

                  {/* İlana Git */}
                  <Button
                    onClick={() => router.push(`/jobs/${bid.job_id}`)}
                    variant="outline"
                    size="sm"
                    className="ml-auto flex items-center gap-2"
                  >
                    İlanı Görüntüle
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Teklifi Düzenle</h2>
                <p className="mt-1 text-sm text-gray-600">
                  {getEditInfo(editingBid).text}
                </p>
              </div>
              <button
                onClick={() => setEditingBid(null)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* İlan Bilgisi */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">İlan:</p>
                <p className="mt-1 font-semibold text-gray-900">{editingBid.job.title}</p>
              </div>

              {/* Tutar */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Teklif Tutarı (₺) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">₺</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="pl-8 text-base"
                    placeholder="1000"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Bütçe aralığı: ₺{editingBid.job.budget_min.toLocaleString()} - ₺{editingBid.job.budget_max.toLocaleString()}
                </p>
              </div>

              {/* Mesaj */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mesajınız <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={editForm.message}
                  onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                  rows={5}
                  className="resize-none"
                  placeholder="Neden sizi seçmeli? Deneyimlerinizi ve yaklaşımınızı paylaşın..."
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="flex-1 bg-sky-600 py-6 text-lg font-semibold hover:bg-sky-700"
                >
                  {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
                <Button
                  onClick={() => setEditingBid(null)}
                  variant="outline"
                  className="flex-1 py-6 text-lg font-semibold"
                >
                  İptal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBidId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h2 className="mb-3 text-center text-2xl font-bold text-gray-900">
              Teklifi Sil
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Bu teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => handleDelete(deletingBidId)}
                disabled={loading}
                className="flex-1 bg-red-600 py-3 hover:bg-red-700"
              >
                {loading ? "Siliniyor..." : "Evet, Sil"}
              </Button>
              <Button
                onClick={() => setDeletingBidId(null)}
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

