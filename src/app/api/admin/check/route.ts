import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { isAdmin: false, role: null, error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Get user profile with admin info
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("admin_role, is_super_admin")
      .eq("id", user.id)
      .single();
    
    if (profileError) {
      return NextResponse.json(
        { isAdmin: false, role: null, error: "Profile not found" },
        { status: 404 }
      );
    }
    
    const isAdmin = profile.admin_role !== null;
    
    return NextResponse.json({
      isAdmin,
      role: profile.admin_role,
      isSuperAdmin: profile.is_super_admin || false,
      userId: user.id,
    });
    
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { isAdmin: false, role: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

