"use client";

import Link from "next/link";
import { MapPin, Calendar, DollarSign, Tag, MessageCircle, TrendingUp } from "lucide-react";
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

interface Props {
  jobs: Job[];
  isProvider: boolean;
  city?: string;
}

export default function DashboardJobsClient({ jobs, isProvider, city }: Props) {
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
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="group block overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg"
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
                    
                    {job.bid_count > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                        <MessageCircle className="h-3 w-3" />
                        {job.bid_count} Teklif
                      </span>
                    )}
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(job.created_at)}
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

