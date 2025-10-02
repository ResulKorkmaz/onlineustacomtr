import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect("/login?redirect=admin");
  }
  
  // Check admin role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("admin_role, is_super_admin, full_name")
    .eq("id", user.id)
    .single();
  
  if (profileError || !profile || !profile.admin_role) {
    // Not an admin, redirect to dashboard
    redirect("/dashboard");
  }
  
  return (
    <AdminLayoutClient
      adminRole={profile.admin_role}
      isSuperAdmin={profile.is_super_admin || false}
      adminName={profile.full_name || "Admin"}
    >
      {children}
    </AdminLayoutClient>
  );
}

