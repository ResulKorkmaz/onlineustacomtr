"use client";

import Link from "next/link";
import {
  Users,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  UserCheck,
  UserPlus,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalCustomers: number;
  totalJobs: number;
  activeJobs: number;
  totalBids: number;
  pendingBids: number;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: "provider" | "customer";
  created_at: string;
}

interface Job {
  id: number;
  title: string;
  status: string;
  created_at: string;
  customer: {
    full_name: string;
    email: string;
  };
}

interface Props {
  stats: Stats;
  recentUsers: User[];
  recentJobs: Job[];
}

export default function AdminDashboardClient({
  stats,
  recentUsers,
  recentJobs,
}: Props) {
  const statCards = [
    {
      label: "Toplam Kullanıcı",
      value: stats.totalUsers,
      icon: <Users className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/users",
    },
    {
      label: "Hizmet Verenler",
      value: stats.totalProviders,
      icon: <UserCheck className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      href: "/admin/users?filter=provider",
    },
    {
      label: "Müşteriler",
      value: stats.totalCustomers,
      icon: <UserPlus className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/admin/users?filter=customer",
    },
    {
      label: "Toplam İlan",
      value: stats.totalJobs,
      icon: <Briefcase className="h-6 w-6" />,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/admin/jobs",
    },
    {
      label: "Aktif İlanlar",
      value: stats.activeJobs,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-sky-500 to-sky-600",
      textColor: "text-sky-600",
      bgColor: "bg-sky-50",
      href: "/admin/jobs?filter=active",
    },
    {
      label: "Toplam Teklif",
      value: stats.totalBids,
      icon: <MessageSquare className="h-6 w-6" />,
      color: "from-pink-500 to-pink-600",
      textColor: "text-pink-600",
      bgColor: "bg-pink-50",
      href: "/admin/bids",
    },
    {
      label: "Bekleyen Teklifler",
      value: stats.pendingBids,
      icon: <Clock className="h-6 w-6" />,
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/admin/bids?filter=pending",
    },
    {
      label: "Platform Sağlığı",
      value: "99.9%",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "from-teal-500 to-teal-600",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50",
      href: "/admin/settings",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Platform overview ve son aktiviteler
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-xl border bg-white p-6 transition hover:shadow-lg"
          >
            {/* Icon Background */}
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl transition group-hover:opacity-20`} />

            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`rounded-lg ${stat.bgColor} p-3`}>
                  <div className={stat.textColor}>{stat.icon}</div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
              </div>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 transform translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-xl border bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Son Kayıt Olan Kullanıcılar
            </h2>
            <Link
              href="/admin/users"
              className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">
                Henüz kullanıcı yok
              </p>
            ) : (
              recentUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/admin/users/${user.id}`}
                  className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "provider"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {user.role === "provider" ? "Hizmet Veren" : "Müşteri"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="rounded-xl border bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Son Oluşturulan İlanlar
            </h2>
            <Link
              href="/admin/jobs"
              className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="space-y-4">
            {recentJobs.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">
                Henüz ilan yok
              </p>
            ) : (
              recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/admin/jobs/${job.id}`}
                  className="flex items-start gap-4 rounded-lg border p-4 transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {job.customer?.full_name || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        job.status === "open"
                          ? "bg-green-100 text-green-800"
                          : job.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.status === "open"
                        ? "Açık"
                        : job.status === "in_progress"
                        ? "Devam Ediyor"
                        : "Kapalı"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

