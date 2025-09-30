import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-2">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="block rounded-lg px-4 py-2 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              className="block rounded-lg px-4 py-2 hover:bg-gray-100"
            >
              Profil
            </Link>
            <Link
              href="/dashboard/jobs"
              className="block rounded-lg px-4 py-2 hover:bg-gray-100"
            >
              İlanlarım
            </Link>
            <Link
              href="/dashboard/bids"
              className="block rounded-lg px-4 py-2 hover:bg-gray-100"
            >
              Tekliflerim
            </Link>
            <Link
              href="/dashboard/notifications"
              className="block rounded-lg px-4 py-2 hover:bg-gray-100"
            >
              Bildirimler
            </Link>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
