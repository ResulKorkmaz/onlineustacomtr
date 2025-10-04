"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Plus, Home, User, Briefcase, MessageSquare, CheckCircle, Wallet, Settings } from "lucide-react";

interface DashboardLayoutClientProps {
  isProvider: boolean;
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ isProvider, children }: DashboardLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // STANDART HİZMET VEREN MENÜSÜ - ASLA BOZMA!
  // Kaynak: docs/MENU_STRUCTURE.md
  const providerMenuItems = [
    { href: "/dashboard", label: "Ana Sayfa", icon: Home },
    { href: "/dashboard/profile", label: "Profil", icon: User },
    { href: "/dashboard/jobs", label: "İlanlar", icon: Briefcase },
    { href: "/dashboard/bids", label: "Tekliflerim", icon: MessageSquare },
    { href: "/dashboard/completed", label: "Tamamlananlar", icon: CheckCircle },
    { href: "/dashboard/balance", label: "Bütçem", icon: Wallet },
    { href: "/dashboard/settings", label: "Ayarlar", icon: Settings },
  ];

  // Müşteri menüleri (geçici)
  const customerMenuItems = [
    { href: "/dashboard", label: "Ana Sayfa", icon: Home },
    { href: "/dashboard/profile", label: "Profil", icon: User },
    { href: "/dashboard/jobs", label: "İlanlarım", icon: Briefcase },
  ];

  const menuItems = isProvider ? providerMenuItems : customerMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-white border-b lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-lg font-bold text-sky-600">Online Usta</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Menü</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-sky-50 text-sky-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-2">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                        isActive
                          ? "bg-sky-50 text-sky-600 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="pb-20 lg:pb-0">{children}</main>
        </div>
      </div>

      {/* Floating Action Button (Mobile) - İlan Ver */}
      <Link
        href="/jobs/new"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg hover:bg-sky-700 active:scale-95 transition-all lg:hidden"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}

