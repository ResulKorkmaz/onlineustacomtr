import { createClient } from "@/lib/supabase/server";
import AdminDashboardClient from "./page-client";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch stats in parallel
  const [
    { count: totalUsers },
    { count: totalProviders },
    { count: totalCustomers },
    { count: totalJobs },
    { count: activeJobs },
    { count: totalBids },
    { count: pendingBids },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "provider"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("bids").select("*", { count: "exact", head: true }),
    supabase.from("bids").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  // Recent users (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(10);

  // Recent jobs
  const { data: recentJobs } = await supabase
    .from("jobs")
    .select(`
      *,
      customer:profiles!jobs_customer_id_fkey(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <AdminDashboardClient
      stats={{
        totalUsers: totalUsers || 0,
        totalProviders: totalProviders || 0,
        totalCustomers: totalCustomers || 0,
        totalJobs: totalJobs || 0,
        activeJobs: activeJobs || 0,
        totalBids: totalBids || 0,
        pendingBids: pendingBids || 0,
      }}
      recentUsers={recentUsers || []}
      recentJobs={recentJobs || []}
    />
  );
}

