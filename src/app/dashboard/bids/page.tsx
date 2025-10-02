import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BidsManagementClient from "./client";

export const revalidate = 0; // Real-time updates için

export default async function DashboardBidsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Profil bilgilerini al
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "provider") {
    redirect("/dashboard");
  }

  // Provider'ın verdiği teklifleri getir
  const { data: bids } = await supabase
    .from("bids")
    .select(`
      *,
      job:jobs(
        id,
        title,
        description,
        city,
        district,
        budget_min,
        budget_max,
        status,
        category,
        job_date,
        job_time,
        customer:profiles!jobs_customer_id_fkey(full_name)
      )
    `)
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <BidsManagementClient 
      bids={bids || []} 
      userId={user.id}
    />
  );
}

