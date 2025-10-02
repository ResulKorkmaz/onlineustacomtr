import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const profileData = await request.json();

    // ID kontrolü - zorunlu alan
    if (!profileData.id) {
      return NextResponse.json(
        { error: "User ID gerekli" },
        { status: 400 }
      );
    }

    // Admin client ile RLS bypass (kayıt esnasında session olmadığı için gerekli)
    const supabase = createAdminClient();

    // Email doğrulaması yapılmadan önce profil oluşturulmalı
    // Çünkü kayıt sonrası email onay bekleniyor
    
    // Profil oluştur veya güncelle
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

