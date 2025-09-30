"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
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
