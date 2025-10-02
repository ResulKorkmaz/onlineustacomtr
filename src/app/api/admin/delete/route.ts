import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("admin_role, is_super_admin")
      .eq("id", user.id)
      .single();
    
    if (!profile || !profile.admin_role) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }
    
    // Get request body
    const { adminId } = await request.json();
    
    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }
    
    // Cannot delete yourself
    if (adminId === user.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      );
    }
    
    // Get target admin
    const { data: targetAdmin } = await supabase
      .from("profiles")
      .select("admin_role, is_super_admin, full_name, email")
      .eq("id", adminId)
      .single();
    
    if (!targetAdmin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }
    
    // Cannot delete super admin (trigger will also prevent this)
    if (targetAdmin.is_super_admin) {
      return NextResponse.json(
        { error: "Super admin cannot be deleted" },
        { status: 403 }
      );
    }
    
    // Admin cannot delete other admins
    if (profile.admin_role === "admin" && targetAdmin.admin_role === "admin") {
      return NextResponse.json(
        { error: "Admin cannot delete other admins" },
        { status: 403 }
      );
    }
    
    // Remove admin role (set to null)
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        admin_role: null,
        is_super_admin: false,
        created_by_admin: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", adminId);
    
    if (updateError) {
      throw updateError;
    }
    
    // Log admin activity
    await supabase
      .from("admin_logs")
      .insert({
        admin_id: user.id,
        action: "delete",
        target_type: "admin",
        target_id: adminId,
        details: {
          role: targetAdmin.admin_role,
          full_name: targetAdmin.full_name,
          email: targetAdmin.email,
        },
      });
    
    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    });
    
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

