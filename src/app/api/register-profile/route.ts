import { createAdminClient, createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Auth kontrolü - normal client ile
    const authSupabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const profileData = await request.json();

    // Güvenlik: Kullanıcı sadece kendi profilini oluşturabilir
    if (profileData.id !== user.id) {
      return NextResponse.json(
        { error: "Yetkisiz işlem" },
        { status: 403 }
      );
    }

    // Admin client ile RLS bypass (sadece profil creation için)
    const supabase = createAdminClient();

    // Profil oluştur
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profileData, {
        onConflict: "id",
      })
      .select()
      .single();

    if (error) {
      console.error("Profile creation error:", error);
      return NextResponse.json(
        { error: "Profil oluşturulamadı. Lütfen tekrar deneyin." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Profil oluşturulamadı";
    console.error("API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

