"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";
import { MapPin, Calendar, DollarSign, Clock, Tag, User, MessageCircle, CheckCircle, TrendingUp } from "lucide-react";
import type { Job, Bid } from "@/lib/types/database.types";
import { useRouter } from "next/navigation";

interface Props {
  job: Job;
  bids: Bid[] | null;
  userId: string | null;
}

export default function JobDetailClient({ job, bids, userId }: Props) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBidForm, setShowBidForm] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const isOwner = userId && userId === job.customer_id;
  const hasBid = bids && bids.length > 0;

  async function handleSubmitBid() {
    if (!userId || !amount || !message) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }
    
    console.log("[BidSubmit] Starting...", { userId, jobId: job.id, amount, message });
    
    setLoading(true);
    setError("");

    // Timeout: 15 saniye sonra hata göster
    const timeoutId = setTimeout(() => {
      console.error("[BidSubmit] Timeout! İşlem 15 saniyede tamamlanamadı");
      setError("İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.");
      setLoading(false);
    }, 15000);

    try {
      // Önce profil kontrolü
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", userId)
        .single();

      console.log("[BidSubmit] Profile check:", { profile, profileError });

      if (profileError || !profile) {
        clearTimeout(timeoutId);
        console.error("[BidSubmit] Profile not found!");
        setError("Profiliniz bulunamadı. Lütfen çıkış yapıp tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      if (profile.role !== "provider") {
        clearTimeout(timeoutId);
        console.error("[BidSubmit] User is not a provider!");
        setError("Sadece hizmet verenler teklif verebilir.");
        setLoading(false);
        return;
      }

      // Teklif gönder
      const { data, error: submitError } = await supabase
        .from("bids")
        .insert({
          job_id: job.id,
          provider_id: userId,
          amount: parseFloat(amount),
          message,
        })
        .select();

      clearTimeout(timeoutId);
      console.log("[BidSubmit] Response:", { data, error: submitError });

      if (submitError) {
        console.error("[BidSubmit] Error:", submitError);
        setError(submitError.message || "Teklif gönderilemedi. Detay: " + JSON.stringify(submitError));
        setLoading(false);
        return;
      }

      console.log("[BidSubmit] Success!");
      setAmount("");
      setMessage("");
      setShowBidForm(false);
      alert("Teklifiniz başarıyla gönderildi!");
      
      // Sayfayı yenile
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("[BidSubmit] Exception:", err);
      setError("Hata: " + (err?.message || "Beklenmeyen bir hata oluştu"));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-4xl">
        
        {/* ==================== İLAN KARTI - MİNİMAL ==================== */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden mb-4">
          {/* Üst Kısım: İsim + Tarih */}
          <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-900">İlan Sahibi</span>
            </div>
            <span className="text-xs text-gray-500">{formatRelativeTime(job.created_at)}</span>
          </div>

          {/* İçerik */}
          <div className="p-4 space-y-3">
            {/* Başlık */}
            <h1 className="text-base md:text-lg font-semibold text-gray-900 leading-snug">
              {job.title}
            </h1>

            {/* Açıklama */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {job.description}
            </p>

            {/* Etiketler - Kategori, Konum, Bütçe */}
            <div className="flex flex-wrap gap-2">
              {job.category && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  <Tag className="h-3 w-3" />
                  {job.category}
                </span>
              )}
              
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <MapPin className="h-3 w-3" />
                {job.city}
              </span>

              {job.budget_min && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <DollarSign className="h-3 w-3" />
                  ₺{job.budget_min}-₺{job.budget_max}
                </span>
              )}

              {job.job_date && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                  <Clock className="h-3 w-3" />
                  {new Date(job.job_date).toLocaleDateString('tr-TR')}
                </span>
              )}
            </div>

            {/* Süre/Durum Bilgisi */}
            <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {job.bid_count} teklif
              </span>
              {job.only_price_research && (
                <span className="text-orange-600 font-medium">Fiyat araştırması</span>
              )}
            </div>

            {/* Teklif Ver Butonu - Hizmet Veren İçin */}
            {!isOwner && !hasBid && (
              <button
                onClick={() => setShowBidForm(!showBidForm)}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:from-emerald-600 hover:to-green-600"
              >
                <TrendingUp className="h-4 w-4" />
                {showBidForm ? "Formu Kapat" : "Teklif Ver"}
              </button>
            )}

            {/* Teklif Verildi Mesajı */}
            {!isOwner && hasBid && (
              <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Teklifiniz gönderildi</p>
                    <p className="text-xs text-green-700 mt-1">Teklifiniz: ₺{bids[0].amount.toLocaleString('tr-TR')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== TEKLİF FORMU ==================== */}
        {!isOwner && showBidForm && !hasBid && (
          <div className="rounded-lg border bg-white shadow-sm p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Teklifinizi Gönderin</h3>
            
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Teklif Tutarı (₺)
                </label>
                <Input
                  type="number"
                  placeholder="Örn: 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Mesajınız
                </label>
                <Textarea
                  placeholder="İş hakkında notlarınızı yazın..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSubmitBid}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm"
              >
                {loading ? "Gönderiliyor..." : "Teklifi Gönder"}
              </Button>
            </div>
          </div>
        )}

        {/* ==================== GELEN TEKLİFLER (Müşteri İçin) ==================== */}
        {isOwner && (
          <div className="rounded-lg border bg-white shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-5 w-5 text-sky-600" />
              <h2 className="text-base font-semibold text-gray-900">Gelen Teklifler</h2>
              <span className="ml-auto rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                {job.bid_count}
              </span>
            </div>
            
            {bids && bids.length > 0 ? (
              <div className="space-y-3">
                {bids.map((bid) => (
                  <div key={bid.id} className="rounded-lg border bg-gray-50 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
                          <User className="h-4 w-4 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Hizmet Veren</p>
                          <p className="text-xs text-gray-500">{formatRelativeTime(bid.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-emerald-600">₺{bid.amount.toLocaleString('tr-TR')}</p>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{bid.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <MessageCircle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">Henüz teklif gelmedi</p>
                <p className="text-xs text-gray-500 mt-1">Ustalar ilanınızı görüntülediğinde teklif verecekler</p>
              </div>
            )}
          </div>
        )}

        {/* Geri Dön Butonu */}
        <button
          onClick={() => router.back()}
          className="mt-4 w-full rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          ← Geri Dön
        </button>
      </div>
    </div>
  );
}
