"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Bell, Lock, Globe, CreditCard, Shield, Trash2, 
  LogOut, Home, User, Briefcase, Eye, EyeOff, Key
} from "lucide-react";
import type { Profile } from "@/lib/types/database.types";
import { Button } from "@/components/ui/button";

interface SettingsClientProps {
  profile: Profile;
}

export default function SettingsClient({ profile }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"notifications" | "privacy" | "security" | "payment" | "account">("notifications");
  const router = useRouter();
  const supabase = createClient();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar - SADECE PLATFORM AYARLARI */}
      <div className="w-full border-r bg-white p-6 lg:w-64">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Platform Ayarları</h2>
          <p className="text-sm text-gray-500">Online Usta tercihleriniz</p>
        </div>

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
            <Eye className="h-5 w-5" />
            <span>Gizlilik</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
              activeTab === "security"
                ? "bg-sky-50 text-sky-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Lock className="h-5 w-5" />
            <span>Güvenlik</span>
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
              activeTab === "payment"
                ? "bg-sky-50 text-sky-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Ödeme Bilgileri</span>
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
            <span>Hesap Yönetimi</span>
          </button>

          {/* Divider */}
          <div className="my-4 border-t"></div>

          {/* Hızlı Erişim */}
          <p className="px-4 text-xs font-semibold uppercase text-gray-400">Hızlı Erişim</p>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <Home className="h-5 w-5" />
            <span>Ana Sayfa</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/profile")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <User className="h-5 w-5" />
            <span>Profilim</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/jobs")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <Briefcase className="h-5 w-5" />
            <span>İlanlar</span>
          </button>

          {/* Divider */}
          <div className="my-4 border-t"></div>

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
          <p className="text-gray-600 mb-8">Online Usta platform tercihlerinizi yönetin</p>

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100">
                    <Bell className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Bildirim Tercihleri</h2>
                    <p className="text-sm text-gray-600">Hangi bildirimleri almak istediğinizi seçin</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Yeni İlan Bildirimleri</p>
                      <p className="text-sm text-gray-600">Alanınıza uygun yeni ilanlar yayınlandığında bildirim al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <p className="font-medium text-gray-900">E-posta Bildirimleri</p>
                      <p className="text-sm text-gray-600">Önemli güncellemeler için e-posta al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <p className="font-medium text-gray-900">SMS Bildirimleri</p>
                      <p className="text-sm text-gray-600">Acil durumlar için SMS al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-gray-900">Haftalık Özet</p>
                      <p className="text-sm text-gray-600">Haftalık performans raporu al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <p className="text-sm text-gray-500 pt-4 bg-amber-50 p-3 rounded-lg">
                    ⚠️ Bu özellikler yakında aktif olacak!
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Gizlilik Ayarları</h2>
                    <p className="text-sm text-gray-600">Profilinizin görünürlüğünü kontrol edin</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Profil Görünürlüğü</p>
                      <p className="text-sm text-gray-600">Profilinizi tüm müşteriler görebilsin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Telefon Numarası Paylaşımı</p>
                      <p className="text-sm text-gray-600">Sadece anlaşma sağladığınız müşteriler görsün</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-gray-900">İstatistikleri Göster</p>
                      <p className="text-sm text-gray-600">Tamamlanan iş sayısı ve puanlarınızı göster</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <p className="text-sm text-gray-500 pt-4 bg-amber-50 p-3 rounded-lg">
                    ⚠️ Bu özellikler yakında aktif olacak!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab - YENİ */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                    <Lock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Güvenlik</h2>
                    <p className="text-sm text-gray-600">Hesabınızın güvenliğini sağlayın</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Şifre Değiştir</h3>
                    <p className="text-sm text-gray-600 mb-4">Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin</p>
                    <Button variant="outline" className="gap-2">
                      <Key className="h-4 w-4" />
                      Şifre Değiştir
                    </Button>
                  </div>

                  <div className="border-b pb-6">
                    <h3 className="font-medium text-gray-900 mb-2">İki Faktörlü Doğrulama (2FA)</h3>
                    <p className="text-sm text-gray-600 mb-4">Hesabınıza ekstra güvenlik katmanı ekleyin</p>
                    <Button variant="outline" disabled className="gap-2">
                      <Shield className="h-4 w-4" />
                      2FA Etkinleştir (Yakında)
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Aktif Oturumlar</h3>
                    <p className="text-sm text-gray-600 mb-4">Hesabınıza giriş yapan cihazları görün</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Bu cihaz (Aktif)</p>
                      <p className="text-xs text-gray-500 mt-1">Son giriş: Şimdi</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 pt-4 bg-amber-50 p-3 rounded-lg">
                    ⚠️ Güvenlik özellikleri yakında aktif olacak!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Tab - YENİ */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Ödeme Bilgileri</h2>
                    <p className="text-sm text-gray-600">Kazançlarınız için banka bilgilerinizi ekleyin</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Banka Hesabı</h3>
                    <p className="text-sm text-gray-600 mb-4">Kazançlarınızı almak için banka hesabınızı ekleyin</p>
                    <Button variant="outline" className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      Banka Hesabı Ekle
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Fatura Bilgileri</h3>
                    <p className="text-sm text-gray-600 mb-4">Fatura kesimi için bilgilerinizi güncelleyin</p>
                    <Button variant="outline" disabled>
                      Fatura Bilgileri (Yakında)
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500 pt-4 bg-amber-50 p-3 rounded-lg">
                    ⚠️ Ödeme özellikleri yakında aktif olacak!
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <Globe className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Hesap Yönetimi</h2>
                    <p className="text-sm text-gray-600">Genel hesap ayarlarınız</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Dil Tercihi</h3>
                    <select className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option>Türkçe</option>
                      <option disabled>English (Yakında)</option>
                    </select>
                  </div>

                  <div className="border-b pb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Zaman Dilimi</h3>
                    <select className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option>İstanbul (UTC+3)</option>
                    </select>
                  </div>

                  <div className="border-b pb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Hesabı Dondur</h3>
                    <p className="text-sm text-gray-600 mb-4">Geçici olarak hesabınızı dondurabilirsiniz</p>
                    <Button variant="outline" disabled className="gap-2">
                      <EyeOff className="h-4 w-4" />
                      Hesabı Dondur (Yakında)
                    </Button>
                  </div>

                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h3 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                      <Trash2 className="h-5 w-5" />
                      Hesabı Sil
                    </h3>
                    <p className="text-sm text-red-700 mb-4">
                      Hesabınızı kalıcı olarak silmek istiyorsanız, bu işlem geri alınamaz.
                    </p>
                    <Button variant="outline" disabled className="border-red-300 text-red-600 hover:bg-red-50">
                      Hesabı Sil (Yakında)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
