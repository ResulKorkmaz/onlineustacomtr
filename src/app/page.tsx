import Hero from "@/components/layout/hero";
import JobCard from "@/components/jobs/job-card";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // 60 saniyede bir yenile

export default async function HomePage() {
  const supabase = await createClient();
  
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(9);

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
