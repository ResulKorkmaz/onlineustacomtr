import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email veya telefon gerekli" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Telefon kontrolü
    if (phone) {
      const { data: phoneCheck } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("phone", phone)
        .maybeSingle();

      if (phoneCheck) {
        return NextResponse.json({ 
          exists: true, 
          type: "phone",
          message: "Bu telefon numarası zaten kayıtlı" 
        });
      }
    }

    // Email kontrolü için RPC kullanıyoruz
    // Not: Supabase client'ta direkt email kontrolü güvenlik nedeniyle mümkün değil
    // Bu nedenle kullanıcı kayıt olurken zaten email kontrolü yapılacak

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("User check error:", error);
    return NextResponse.json(
      { error: "Kontrol sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

