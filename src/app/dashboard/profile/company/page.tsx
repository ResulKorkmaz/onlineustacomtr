import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CompanyProfileClient from "./client";

export const dynamic = 'force-dynamic';

export default async function CompanyProfilePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/customer/register");
  }

  // Şirket kontrolü
  if (profile.provider_kind !== "company") {
    redirect("/dashboard/profile/individual");
  }

  return <CompanyProfileClient initialProfile={profile} userEmail={user.email || ""} />;
}
