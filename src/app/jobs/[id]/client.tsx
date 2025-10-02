"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { MapPin, Calendar, DollarSign, Clock, Tag, User, MessageCircle, CheckCircle } from "lucide-react";
import type { Job, Bid } from "@/lib/types/database.types";

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
  const supabase = createClient();

  const isOwner = userId && userId === job.customer_id;

  async function handleSubmitBid() {
    if (!userId) return;
    
    setLoading(true);
    setError("");

    const { error: submitError } = await supabase
      .from("bids")
      .insert({
        job_id: job.id,
        provider_id: userId,
        amount: parseFloat(amount),
        message,
      });

    if (submitError) {
      setError(submitError.message);
    } else {
      setAmount("");
      setMessage("");
      alert("Teklifiniz gönderildi!");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header Card */}
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* Status Badge */}
            <div className="border-b bg-gradient-to-r from-sky-50 to-blue-50 px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                    job.status === "open" 
                      ? "bg-green-100 text-green-700" 
                      : job.status === "closed" 
                      ? "bg-gray-100 text-gray-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                    {job.status === "open" ? "Açık" : job.status === "closed" ? "Kapalı" : "Devam Ediyor"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700">
                    <MessageCircle className="h-4 w-4" />
                    {job.bid_count} Teklif
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  <Calendar className="mr-1 inline h-4 w-4" />
                  {formatRelativeTime(job.created_at)}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
              <h1 className="mb-6 text-3xl font-bold text-gray-900">{job.title}</h1>

              {/* Info Grid */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Kategori */}
                {job.category && (
                  <div className="flex items-start gap-3 rounded-lg bg-purple-50 p-4">
                    <Tag className="h-5 w-5 flex-shrink-0 text-purple-600" />
                    <div>
                      <p className="text-xs text-purple-600">Kategori</p>
                      <p className="font-medium text-purple-900">{job.category}</p>
                    </div>
                  </div>
                )}

                {/* Konum */}
                <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-600">Konum</p>
                    <p className="font-medium text-blue-900">
                      {job.city}
                      {job.district && `, ${job.district}`}
                    </p>
                  </div>
                </div>

                {/* Bütçe */}
                {job.budget_min && (
                  <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4">
                    <DollarSign className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600">Bütçe Aralığı</p>
                      <p className="font-medium text-green-900">
                        ₺{job.budget_min.toLocaleString()} - ₺{(job.budget_max || job.budget_min).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tarih & Saat */}
                {job.job_date && (
                  <div className="flex items-start gap-3 rounded-lg bg-orange-50 p-4">
                    <Clock className="h-5 w-5 flex-shrink-0 text-orange-600" />
                    <div>
                      <p className="text-xs text-orange-600">İş Tarihi</p>
                      <p className="font-medium text-orange-900">
                        {new Date(job.job_date).toLocaleDateString('tr-TR')}
                        {job.job_time && ` ${job.job_time}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Fiyat Araştırması Badge */}
              {job.only_price_research && (
                <div className="mb-6 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-4">
                  <p className="text-sm font-medium text-orange-900">
                    💰 Bu ilan sadece fiyat araştırması amaçlıdır
                  </p>
                </div>
              )}

              {/* Açıklama */}
              <div className="rounded-lg border bg-gray-50 p-6">
                <h3 className="mb-3 font-semibold text-gray-900">İş Açıklaması</h3>
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{job.description}</p>
              </div>
            </div>
          </div>

        {/* Teklifler Bölümü */}
        {isOwner ? (
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-sky-600" />
              <h2 className="text-2xl font-bold text-gray-900">Gelen Teklifler</h2>
            </div>
            
            {bids && bids.length > 0 ? (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid.id} className="rounded-xl border bg-gradient-to-r from-gray-50 to-white p-6 transition hover:shadow-md">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                          <User className="h-6 w-6 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-sky-600">₺{bid.amount.toLocaleString('tr-TR')}</p>
                          <p className="text-sm text-gray-500">{formatRelativeTime(bid.created_at)}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Beklemede
                      </span>
                    </div>
                    <div className="rounded-lg bg-white p-4">
                      <p className="text-gray-700">{bid.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600">Henüz teklif gelmedi.</p>
                <p className="mt-2 text-sm text-gray-500">Ustalar ilanınızı görüntülediğinde teklif verecekler.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Teklif Gönder</h2>
            </div>
            
            {bids && bids.length > 0 ? (
              <div className="rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="mb-2 font-semibold text-green-900">Bu ilana daha önce teklif verdiniz.</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-700">Teklifiniz:</span>
                      <span className="text-xl font-bold text-green-900">₺{bids[0].amount.toLocaleString('tr-TR')}</span>
                    </div>
                    <p className="mt-2 text-sm text-green-700">{bids[0].message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Teklif Tutarı (₺) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">₺</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1000"
                      className="pl-8 text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mesajınız <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Neden sizi seçmeli? Deneyimlerinizi ve yaklaşımınızı paylaşın..."
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleSubmitBid}
                  disabled={!amount || !message || loading}
                  className="w-full bg-sky-600 py-6 text-lg font-semibold hover:bg-sky-700"
                >
                  {loading ? "Gönderiliyor..." : "Teklif Gönder"}
                </Button>

                <div className="rounded-lg border bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    <strong>📌 Not:</strong> Günde maksimum 3 teklif gönderebilirsiniz. Teklifiniz müşteri tarafından görüntülenecektir.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
