import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardJobsClient from "./client";

export const revalidate = 0; // Her zaman güncel veri

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
  let allCategories: string[] = [];
  let allCities: string[] = [];
  let providerBids: number[] = []; // Teklif verilen ilan ID'leri

  if (profile.role === "provider") {
    // Provider için: TÜM AÇIK İLANLARI GETİR (filtreleme client-side yapılacak)
    const { data } = await supabase
      .from("jobs")
      .select(`
        *,
        customer:profiles!jobs_customer_id_fkey(full_name, city, district)
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false });

    jobs = data || [];

    // Provider'ın verdiği teklifleri al
    const { data: bidsData } = await supabase
      .from("bids")
      .select("job_id")
      .eq("provider_id", user.id);

    providerBids = bidsData?.map(b => b.job_id) || [];

    // Benzersiz kategoriler ve iller
    allCategories = [...new Set(jobs.map(j => j.category).filter(Boolean))];
    allCities = [...new Set(jobs.map(j => j.city).filter(Boolean))];
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
      userCity={profile.city}
      allCategories={allCategories}
      allCities={allCities}
      providerBids={providerBids}
    />
  );
}

