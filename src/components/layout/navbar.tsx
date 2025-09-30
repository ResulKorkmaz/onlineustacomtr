import Link from "next/link";
import { Bell, Menu, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-sky-200 bg-sky-500 shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-white">
            OnlineUsta
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/jobs" className="text-sm font-medium text-white/90 hover:text-white">
              İlanlar
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-white/90 hover:text-white">
              Nasıl Çalışır?
            </Link>
            <Link href="/categories" className="text-sm font-medium text-white/90 hover:text-white">
              Kategoriler
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {profile?.role === "customer" && (
                <Link href="/jobs/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">İlan Oluştur</span>
                  </Button>
                </Link>
              )}
              
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-medium text-sky-700">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-sky-600">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-white text-sky-600 hover:bg-sky-50">Kayıt Ol</Button>
              </Link>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
