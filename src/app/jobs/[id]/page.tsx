import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import JobDetailClient from "./client";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const jobId = parseInt(params.id);

  if (isNaN(jobId)) notFound();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (!job) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  let bids = null;
  if (user) {
    const isOwner = user.id === job.customer_id;
    if (isOwner) {
      const { data } = await supabase
        .from("bids")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });
      bids = data;
    } else {
      const { data } = await supabase
        .from("bids")
        .select("*")
        .eq("job_id", jobId)
        .eq("provider_id", user.id)
        .single();
      bids = data ? [data] : [];
    }
  }

  return <JobDetailClient job={job} bids={bids} userId={user?.id || null} />;
}
