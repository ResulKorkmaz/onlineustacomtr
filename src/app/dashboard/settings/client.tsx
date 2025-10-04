"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Settings as SettingsIcon, User, Briefcase, TrendingUp,
  Wallet, MessageSquare, HelpCircle, UserCheck, Shield, LogOut,
  Bell, Lock, Globe
} from "lucide-react";
import type { Profile } from "@/lib/types/database.types";

interface SettingsClientProps {
  profile: Profile;
}

export default function SettingsClient({ profile }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"notifications" | "privacy" | "account">("notifications");
  const router = useRouter();
  const supabase = createClient();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full border-r bg-white p-6 lg:w-64">
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
              activeTab === "notifications"
                ? "bg-sky-50 text-sky-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Bell className="h-5 w-5" />
            <span>Bildirimler</span>
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
              activeTab === "privacy"
                ? "bg-sky-50 text-sky-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Lock className="h-5 w-5" />
            <span>Gizlilik</span>
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
              activeTab === "account"
                ? "bg-sky-50 text-sky-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Globe className="h-5 w-5" />
            <span>Hesap Ayarları</span>
          </button>

          {/* Divider */}
          <div className="my-2 border-t"></div>

          <button
            onClick={() => router.push("/dashboard/profile")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <User className="h-5 w-5" />
            <span>Profil Özeti</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/profile")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <SettingsIcon className="h-5 w-5" />
            <span>Bilgileri Düzenle</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/jobs")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <Briefcase className="h-5 w-5" />
            <span>İşlerim</span>
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Ana Sayfa</span>
          </button>

          {/* Divider */}
          <div className="my-2 border-t"></div>

          <button
            onClick={() => router.push("/dashboard/balance")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <Wallet className="h-5 w-5" />
            <span>Cüzdanım</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/reviews")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Müşteri Yorumları</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/support")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Destek Merkezi</span>
          </button>

          {/* Divider */}
          <div className="my-2 border-t"></div>

          <button
            onClick={() => router.push("/dashboard/switch-to-customer")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <UserCheck className="h-5 w-5" />
            <span>Müşteri Profiline Geç</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/privacy")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <Shield className="h-5 w-5" />
            <span>Veri ve Gizlilik</span>
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Ayarlar</h1>

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="h-6 w-6 text-sky-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Bildirim Ayarları</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Bildirim tercihlerinizi yönetin.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">E-posta Bildirimleri</p>
                      <p className="text-sm text-gray-600">Yeni teklifler ve mesajlar için e-posta al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">SMS Bildirimleri</p>
                      <p className="text-sm text-gray-600">Önemli güncellemeler için SMS al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 pt-4">
                    Bu özellikler yakında aktif olacak!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="h-6 w-6 text-sky-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Gizlilik Ayarları</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Gizlilik ve güvenlik tercihlerinizi yönetin.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Profil Görünürlüğü</p>
                      <p className="text-sm text-gray-600">Profilinizi herkes görebilsin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Telefon Görünürlüğü</p>
                      <p className="text-sm text-gray-600">Telefon numaranızı sadece anlaştığınız müşteriler görsün</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 pt-4">
                    Bu özellikler yakında aktif olacak!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-6 w-6 text-sky-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Hesap Ayarları</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Hesabınızla ilgili genel ayarları yönetin.
                </p>
                <div className="space-y-4">
                  <div className="py-3 border-b">
                    <p className="font-medium text-gray-900 mb-2">Dil</p>
                    <select className="w-full rounded-lg border border-gray-300 px-4 py-2">
                      <option>Türkçe</option>
                      <option disabled>English (Yakında)</option>
                    </select>
                  </div>
                  <div className="py-3 border-b">
                    <p className="font-medium text-gray-900 mb-2">Zaman Dilimi</p>
                    <select className="w-full rounded-lg border border-gray-300 px-4 py-2">
                      <option>İstanbul (UTC+3)</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-500 pt-4">
                    Bu özellikler yakında aktif olacak!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

