"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  Shield,
  Settings,
  ScrollText,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AdminRole } from "@/lib/admin/permissions";

interface AdminLayoutClientProps {
  children: ReactNode;
  adminRole: AdminRole;
  isSuperAdmin: boolean;
  adminName: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  roles: AdminRole[]; // Roles that can see this item
}

export default function AdminLayoutClient({
  children,
  adminRole,
  isSuperAdmin,
  adminName,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["super_admin", "admin", "editor"],
    },
    {
      label: "Kullanıcılar",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      roles: ["super_admin", "admin", "editor"],
    },
    {
      label: "İlanlar",
      href: "/admin/jobs",
      icon: <Briefcase className="h-5 w-5" />,
      roles: ["super_admin", "admin", "editor"],
    },
    {
      label: "Teklifler",
      href: "/admin/bids",
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ["super_admin", "admin", "editor"],
    },
    {
      label: "Admin Yönetimi",
      href: "/admin/admins",
      icon: <Shield className="h-5 w-5" />,
      roles: ["super_admin", "admin"],
    },
    {
      label: "Activity Logs",
      href: "/admin/logs",
      icon: <ScrollText className="h-5 w-5" />,
      roles: ["super_admin", "admin"],
    },
    {
      label: "Ayarlar",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["super_admin"],
    },
  ];

  // Filter nav items based on role
  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(adminRole)
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            {/* Logo / Brand */}
            <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-6">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                  {isSuperAdmin && (
                    <span className="text-xs font-medium text-sky-600">Super Admin</span>
                  )}
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-sky-50 text-sky-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={isActive(item.href) ? "text-sky-600" : "text-gray-400 group-hover:text-gray-600"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="relative border-t border-gray-200 p-4">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{adminName}</p>
                  <p className="text-xs text-gray-500 capitalize">{adminRole.replace("_", " ")}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div className="absolute bottom-full left-4 right-4 z-20 mb-2 rounded-lg border bg-white shadow-lg">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition rounded-t-lg"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      User Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition rounded-b-lg"
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white lg:hidden">
            {/* Close button */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Admin Panel</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-sky-50 text-sky-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{adminName}</p>
                  <p className="text-xs text-gray-500 capitalize">{adminRole.replace("_", " ")}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-sky-600" />
            <span className="text-lg font-bold text-gray-900">Admin</span>
          </Link>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

