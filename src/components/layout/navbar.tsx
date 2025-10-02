"use client";

import Link from "next/link";
import { Bell, Menu, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Profile } from "@/lib/types/database.types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // Auth durumunu kontrol et
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    }

    loadUser();

    // Auth değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setProfile(data);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Route değiştiğinde mobil menüyü kapat
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Mobil menü açıkken body scroll'u engelle
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/jobs", label: "İlanlar" },
    { href: "/how-it-works", label: "Nasıl Çalışır?" },
    { href: "/categories", label: "Kategoriler" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-sky-200 bg-sky-500 shadow-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-white">
              OnlineUsta
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* İlan Oluştur Butonu - Herkese Göster */}
            <Link href="/jobs/new" className="hidden sm:block">
              <Button size="sm" className="bg-white text-sky-600 hover:bg-sky-50">
                <Plus className="h-4 w-4" />
                <span className="ml-1">İlan Ver</span>
              </Button>
            </Link>

            {user ? (
              <>
                <Link href="/dashboard/notifications" className="hidden sm:block">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-sky-600">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-medium text-sky-700 hover:bg-sky-200 transition-colors">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                </Link>
              </>
            ) : (
              <>
                {/* Desktop buttons */}
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-sky-600">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button size="sm" className="bg-white text-sky-600 hover:bg-sky-50">
                    Kayıt Ol
                  </Button>
                </Link>

                {/* Mobile login button - hamburger yanında */}
                <Link href="/login" className="sm:hidden">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-sky-600">
                    Giriş
                  </Button>
                </Link>
              </>
            )}

            {/* Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-sky-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menüyü aç/kapat"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-full max-w-sm overflow-y-auto bg-white shadow-xl md:hidden">
            <div className="flex flex-col p-4">
              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 border-b pb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* User Section */}
              {user ? (
                <div className="mt-4 flex flex-col gap-2">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-medium text-sky-700">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </div>
                      Dashboard
                    </Button>
                  </Link>

                  <Link href="/jobs/new">
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      İlan Ver
                    </Button>
                  </Link>

                  <Link href="/dashboard/notifications">
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="mr-2 h-5 w-5" />
                      Bildirimler
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push("/");
                    }}
                  >
                    Çıkış Yap
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  <Link href="/jobs/new">
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      İlan Ver
                    </Button>
                  </Link>
                  
                  <Link href="/signup">
                    <Button variant="outline" className="w-full">
                      Kayıt Ol
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
