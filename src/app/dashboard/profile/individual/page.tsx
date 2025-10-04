import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import IndividualProfileClient from "./client";

export const dynamic = 'force-dynamic';

export default async function IndividualProfilePage() {
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

  // Şahıs kontrolü
  if (profile.provider_kind !== "individual") {
    redirect("/dashboard/profile/company");
  }

  return <IndividualProfileClient initialProfile={profile} />;
}
