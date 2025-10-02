import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import JobEditClient from "./client";

export default async function JobEditPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  const jobId = parseInt(id);

  if (isNaN(jobId)) notFound();

  // Kullanıcı kontrolü
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // İlanı getir
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !job) notFound();

  // Yetki kontrolü - Sadece ilan sahibi düzenleyebilir
  if (job.customer_id !== user.id) {
    redirect("/dashboard/jobs");
  }

  return <JobEditClient job={job} />;
}

