import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Profil tipine göre yönlendir
  if (profile) {
    if (profile.role === "customer") {
      redirect("/dashboard/profile/customer");
    } else if (profile.provider_kind === "individual") {
      redirect("/dashboard/profile/individual");
    } else if (profile.provider_kind === "company") {
      redirect("/dashboard/profile/company");
    }
  }

  // Fallback
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Profil yükleniyor...</p>
      </div>
    </div>
  );
}
