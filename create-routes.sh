#!/bin/bash
set -e

echo "🛣️  App routes oluşturuluyor..."

# Layout ve ana sayfa
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "OnlineUsta - İhtiyacınız olan ustayı bulun",
    template: "%s | OnlineUsta",
  },
  description: "İlan oluşturun, teklifleri görün, güvenilir ustalarla çalışın",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
EOF

cat > src/app/page.tsx << 'EOF'
import Hero from "@/components/layout/hero";
import JobCard from "@/components/jobs/job-card";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // 60 saniyede bir yenile

export default async function HomePage() {
  const supabase = await createClient();
  
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(9);

  return (
    <main className="flex-1">
      <Hero />
      
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Son İlanlar</h2>
          <Link href="/jobs">
            <Button variant="outline">Tümünü Gör</Button>
          </Link>
        </div>
        
        {jobs && jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed bg-gray-50 p-12 text-center">
            <p className="text-gray-600">Henüz ilan bulunmuyor.</p>
            <Link href="/jobs/new" className="mt-4 inline-block">
              <Button>İlk İlanı Sen Oluştur</Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
EOF

# Auth sayfaları
mkdir -p src/app/login

cat > src/app/login/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl">📧</div>
          <h2 className="mb-2 text-2xl font-bold">E-posta Gönderildi</h2>
          <p className="text-gray-600">
            <strong>{email}</strong> adresine giriş bağlantısı gönderdik.
            Lütfen e-postanızı kontrol edin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Giriş Yap / Kayıt Ol</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">E-posta Adresi</label>
            <Input
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={error}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Giriş Bağlantısı Gönder"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          E-posta adresinize gönderilecek bağlantı ile güvenli giriş yapabilirsiniz.
        </p>
      </div>
    </div>
  );
}
EOF

# Auth callback
mkdir -p src/app/auth/callback

cat > src/app/auth/callback/route.ts << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Onboarding veya dashboard'a yönlendir
  return NextResponse.redirect(`${origin}/onboarding`);
}
EOF

echo "✓ Auth sayfaları oluşturuldu"

# Onboarding
mkdir -p src/app/onboarding

cat > src/app/onboarding/page.tsx << 'EOF'
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Role = "customer" | "provider" | "";
type Kind = "individual" | "company" | "";

export default function OnboardingPage() {
  const [role, setRole] = useState<Role>("");
  const [kind, setKind] = useState<Kind>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkProfile();
  }, []);

  async function checkProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      // Profil varsa dashboard'a yönlendir
      router.push("/dashboard");
    } else {
      // Profil yoksa oluştur (placeholder)
      await supabase.from("profiles").insert({
        id: user.id,
        role: "customer",
      });
    }
  }

  async function handleSubmit() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates: any = { role };
    if (role === "provider") {
      updates.provider_kind = kind;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (!error) {
      router.push("/dashboard");
    }

    setLoading(false);
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Hoş Geldiniz!</h1>
        <p className="mb-8 text-gray-600">
          Platformu kullanmaya başlamak için lütfen aşağıdaki bilgileri seçin.
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-3 block font-medium">Rolünüzü Seçin</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setRole("customer")}
                className={`rounded-lg border-2 p-6 text-left transition ${
                  role === "customer"
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="mb-2 text-2xl">👤</div>
                <h3 className="font-semibold">Müşteri</h3>
                <p className="text-sm text-gray-600">İlan oluşturup teklif alacağım</p>
              </button>

              <button
                onClick={() => setRole("provider")}
                className={`rounded-lg border-2 p-6 text-left transition ${
                  role === "provider"
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="mb-2 text-2xl">🔧</div>
                <h3 className="font-semibold">Hizmet Veren</h3>
                <p className="text-sm text-gray-600">İlanları görüp teklif vereceğim</p>
              </button>
            </div>
          </div>

          {role === "provider" && (
            <div>
              <label className="mb-3 block font-medium">Hizmet Veren Tipi</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setKind("individual")}
                  className={`rounded-lg border-2 p-6 text-left transition ${
                    kind === "individual"
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="mb-2 text-2xl">👨‍🔧</div>
                  <h3 className="font-semibold">Şahıs</h3>
                  <p className="text-sm text-gray-600">Bireysel çalışıyorum</p>
                </button>

                <button
                  onClick={() => setKind("company")}
                  className={`rounded-lg border-2 p-6 text-left transition ${
                    kind === "company"
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="mb-2 text-2xl">🏢</div>
                  <h3 className="font-semibold">Şirket</h3>
                  <p className="text-sm text-gray-600">Şirket olarak hizmet veriyorum</p>
                </button>
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!role || (role === "provider" && !kind) || loading}
            className="w-full"
          >
            {loading ? "Kaydediliyor..." : "Devam Et"}
          </Button>
        </div>
      </div>
    </div>
  );
}
EOF

echo "✓ Onboarding sayfası oluşturuldu"
echo "✅ App routes hazır!"
