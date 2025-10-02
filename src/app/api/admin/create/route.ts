import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { AdminRole } from "@/lib/admin/permissions";

export async function POST(request: NextRequest) {
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
    const { email, role } = await request.json();
    
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }
    
    // Permission check: Admin can only create editors
    if (profile.admin_role === "admin" && role !== "editor") {
      return NextResponse.json(
        { error: "Admin can only create editors" },
        { status: 403 }
      );
    }
    
    // Find user by email
    const { data: targetUser } = await supabase
      .from("profiles")
      .select("id, admin_role")
      .eq("email", email)
      .single();
    
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found with this email" },
        { status: 404 }
      );
    }
    
    // Check if user is already an admin
    if (targetUser.admin_role) {
      return NextResponse.json(
        { error: "User is already an admin" },
        { status: 400 }
      );
    }
    
    // Update user to admin/editor
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        admin_role: role,
        is_super_admin: false, // Only manually set super admin
        created_by_admin: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUser.id);
    
    if (updateError) {
      throw updateError;
    }
    
    // Log admin activity
    await supabase
      .from("admin_logs")
      .insert({
        admin_id: user.id,
        action: "create",
        target_type: "admin",
        target_id: targetUser.id,
        details: {
          role,
          email,
        },
      });
    
    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
    });
    
  } catch (error) {
    console.error("Admin create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

