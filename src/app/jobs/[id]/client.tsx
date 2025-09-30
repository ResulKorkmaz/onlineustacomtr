"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { MapPin, Calendar, DollarSign } from "lucide-react";
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
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border bg-white p-8">
          <div className="mb-4 flex items-start justify-between">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700">
              {job.bid_count} Teklif
            </span>
          </div>

          <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{job.city}{job.district && `, ${job.district}`}</span>
            </div>
            
            {job.budget_min && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>
                  {formatCurrency(job.budget_min)} - {formatCurrency(job.budget_max || job.budget_min)}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatRelativeTime(job.created_at)}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
          </div>
        </div>

        {isOwner ? (
          <div className="rounded-2xl border bg-white p-8">
            <h2 className="mb-4 text-xl font-bold">Gelen Teklifler</h2>
            {bids && bids.length > 0 ? (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">{formatCurrency(bid.amount)}</span>
                      <span className="text-sm text-gray-500">{formatRelativeTime(bid.created_at)}</span>
                    </div>
                    <p className="text-gray-700">{bid.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Henüz teklif yok.</p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-8">
            <h2 className="mb-4 text-xl font-bold">Teklif Gönder</h2>
            
            {bids && bids.length > 0 ? (
              <div className="rounded-lg bg-green-50 p-4">
                <p className="font-medium text-green-800">Bu ilana daha önce teklif verdiniz.</p>
                <div className="mt-2 text-sm text-green-700">
                  <p>Teklifiniz: {formatCurrency(bids[0].amount)}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-medium">Teklif Tutarı (TRY)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium">Mesajınız</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Neden sizi seçmeli? Deneyimleriniz neler?"
                    rows={4}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleSubmitBid}
                  disabled={!amount || !message || loading}
                  className="w-full"
                >
                  {loading ? "Gönderiliyor..." : "Teklif Gönder"}
                </Button>

                <p className="text-sm text-gray-600">
                  <strong>Not:</strong> Günde maksimum 3 teklif gönderebilirsiniz.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
