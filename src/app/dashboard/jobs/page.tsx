import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardJobsClient from "./client";

export const revalidate = 30;

export default async function DashboardJobsPage() {
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

  if (!profile) {
    redirect("/customer/register");
  }

  let jobs = [];

  if (profile.role === "provider") {
    // Provider için: Kendi ilindeki ve kategorilerine uygun ilanları göster
    const { data } = await supabase
      .from("jobs")
      .select(`
        *,
        customer:profiles!jobs_customer_id_fkey(full_name, city, district)
      `)
      .eq("city", profile.city)
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(20);

    jobs = data || [];
  } else {
    // Customer için: Kendi ilanlarını göster
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    jobs = data || [];
  }

  return (
    <DashboardJobsClient 
      jobs={jobs} 
      isProvider={profile.role === "provider"} 
      city={profile.city}
    />
  );
}

