import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminManagementClient from "./page-client";

// Force dynamic rendering for admin management
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminManagementPage() {
  const supabase = await createClient();
  
  // Check authentication and admin role
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login?redirect=admin/admins");
  }
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("admin_role, is_super_admin")
    .eq("id", user.id)
    .single();
  
  // Only super_admin and admin can access this page
  if (!profile || !profile.admin_role || 
      !["super_admin", "admin"].includes(profile.admin_role)) {
    redirect("/admin");
  }
  
  // Fetch all admin users
  const { data: admins } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, admin_role, is_super_admin, created_at, last_login_at, created_by_admin")
    .not("admin_role", "is", null)
    .order("is_super_admin", { ascending: false })
    .order("created_at", { ascending: false });
  
  return (
    <AdminManagementClient
      admins={admins || []}
      currentUserRole={profile.admin_role}
      isSuperAdmin={profile.is_super_admin || false}
    />
  );
}

