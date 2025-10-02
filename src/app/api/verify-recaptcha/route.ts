import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token gerekli" },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY tanımlı değil");
      return NextResponse.json(
        { success: false, error: "reCAPTCHA yapılandırması eksik" },
        { status: 500 }
      );
    }

    // Google reCAPTCHA'ya doğrulama isteği gönder
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    // reCAPTCHA v3 skor kontrolü (0.0 - 1.0)
    // 0.5'in üstü güvenilir sayılır
    if (data.success && data.score >= 0.5) {
      return NextResponse.json({
        success: true,
        score: data.score,
      });
    } else {
      return NextResponse.json({
        success: false,
        score: data.score || 0,
        error: "reCAPTCHA doğrulaması başarısız",
        details: data["error-codes"] || [],
      });
    }
  } catch (error) {
    console.error("reCAPTCHA doğrulama hatası:", error);
    return NextResponse.json(
      { success: false, error: "Doğrulama hatası" },
      { status: 500 }
    );
  }
}

