import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const profileData = await request.json();

    // Admin client ile RLS bypass
    const supabase = createAdminClient();

    // Profil oluştur
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profileData, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error("Profile creation error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Profil oluşturulamadı" },
      { status: 500 }
    );
  }
}

