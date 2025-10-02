import Hero from "@/components/layout/hero";
import JobCard from "@/components/jobs/job-card";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PAGINATION } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OnlineUsta - İhtiyacınız Olan Ustayı Bulun",
  description:
    "Güvenilir ustalar, şeffaf fiyatlandırma. Elektrikçi, tesisatçı, boyacı ve daha fazlası. Türkiye'nin her yerinden profesyonel hizmet.",
  keywords: ["usta", "elektrikçi", "tesisatçı", "boyacı", "tamir", "hizmet"],
  openGraph: {
    title: "OnlineUsta - İhtiyacınız Olan Ustayı Bulun",
    description: "Güvenilir ustalar, şeffaf fiyatlandırma.",
    type: "website",
    locale: "tr_TR",
    siteName: "OnlineUsta",
  },
};

export const revalidate = 60; // 60 saniyede bir yenile

export default async function HomePage() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customer:profiles!customer_id(full_name, company_name, avatar_url),
      category:categories(name, slug, icon_name)
    `
    )
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(PAGINATION.HOME_JOBS_LIMIT);

  return (
    <main className="flex-1">
      <Hero />
      
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Son İlanlar</h2>
          <Link href="/jobs">
            <Button variant="outline">Tümünü Gör</Button>
          </Link>
        </div>
        
        {jobs && jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed bg-gray-50 p-12 text-center">
            <p className="text-gray-600">Henüz ilan bulunmuyor.</p>
            <Link href="/jobs/new" className="mt-4 inline-block">
              <Button>İlk İlanı Sen Oluştur</Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
