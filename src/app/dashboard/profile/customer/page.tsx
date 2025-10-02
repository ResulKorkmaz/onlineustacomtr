"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { 
  Phone, Mail, MapPin, Edit, Save, X, User, Briefcase, 
  Star, TrendingUp, Settings, Calendar, Wallet, MessageSquare,
  HelpCircle, Shield, LogOut, Plus
} from "lucide-react";
import type { Profile } from "@/lib/types/database.types";
import { CITIES, DISTRICTS } from "@/lib/constants";

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "edit">("overview");
  const router = useRouter();
  const supabase = createClient();

  const [editData, setEditData] = useState({
    full_name: "",
    phone: "",
    city: "",
    district: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      // Müşteri kontrolü
      if (profileData.role !== "customer") {
        // Eğer provider ise kendi profil sayfasına yönlendir
        if (profileData.provider_kind === "individual") {
          router.push("/dashboard/profile/individual");
        } else if (profileData.provider_kind === "company") {
          router.push("/dashboard/profile/company");
        }
        return;
      }

      setProfile(profileData);
      setEditData({
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        city: profileData.city || "",
        district: profileData.district || "",
        address: profileData.address || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update(editData).eq("id", profile.id);

      if (error) throw error;

      await loadProfile();
      setActiveTab("overview");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Profil güncellenirken hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-72 border-r bg-white lg:block">
          <div className="sticky top-0 p-6">
            {/* Profile Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-3xl font-bold text-white shadow-lg">
                {profile.full_name?.charAt(0) || "?"}
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900">{profile.full_name}</h3>
              <p className="text-sm text-gray-500">Müşteri Hesabı</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  activeTab === "overview"
                    ? "bg-sky-50 text-sky-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profil Özeti</span>
              </button>

              <button
                onClick={() => setActiveTab("edit")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  activeTab === "edit"
                    ? "bg-sky-50 text-sky-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Bilgileri Düzenle</span>
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
                onClick={() => router.push("/jobs/new")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
              >
                <Plus className="h-5 w-5" />
                <span>Yeni İlan Oluştur</span>
              </button>

              <button
                onClick={() => router.push("/dashboard/jobs")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
              >
                <Briefcase className="h-5 w-5" />
                <span>İlanlarımı Görüntüle</span>
              </button>

              <button
                onClick={() => router.push("/dashboard/messages")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Mesajlarım</span>
              </button>

              {/* Divider */}
              <div className="my-2 border-t"></div>

              <button
                onClick={() => router.push("/dashboard/support")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Destek Merkezi</span>
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
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-10">
          {activeTab === "overview" && (
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Profil Özeti</h1>
                <p className="mt-2 text-gray-600">Hesap bilgilerinizi ve istatistiklerinizi görüntüleyin</p>
              </div>

              {/* Profile Card */}
              <div className="rounded-2xl border bg-white p-8 shadow-sm">
                {/* Mobile Profile Header */}
                <div className="mb-8 flex items-start gap-6 lg:hidden">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-3xl font-bold text-white shadow-lg">
                    {profile.full_name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">{profile.full_name || "İsimsiz Kullanıcı"}</h2>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      Müşteri
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">İletişim Bilgileri</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">E-posta</p>
                          <p className="font-medium text-gray-900">{userEmail}</p>
                        </div>
                      </div>

                      {profile.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Telefon</p>
                            <p className="font-medium text-gray-900">{profile.phone}</p>
                          </div>
                        </div>
                      )}

                      {profile.city && (
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Konum</p>
                            <p className="font-medium text-gray-900">
                              {profile.city}
                              {profile.district && ` / ${profile.district}`}
                            </p>
                            {profile.address && <p className="mt-1 text-sm text-gray-600">{profile.address}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="border-t pt-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">İstatistikler</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 p-6">
                        <Briefcase className="mb-3 h-8 w-8 text-sky-600" />
                        <div className="text-3xl font-bold text-gray-900">
                          {profile.completed_jobs_count || 0}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">Tamamlanan İlan</p>
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
                        <Star className="mb-3 h-8 w-8 fill-yellow-400 text-yellow-400" />
                        <div className="text-3xl font-bold text-gray-900">
                          {profile.average_rating?.toFixed(1) || "0.0"}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">Verilen Puan Ortalaması</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Button
                  onClick={() => router.push("/jobs/new")}
                  size="lg"
                  className="w-full"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Yeni İlan Oluştur
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/jobs")}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  İlanlarımı Görüntüle
                </Button>
              </div>
            </div>
          )}

          {activeTab === "edit" && (
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Bilgileri Düzenle</h1>
                <p className="mt-2 text-gray-600">Profil bilgilerinizi güncelleyin</p>
              </div>

              {/* Edit Form */}
              <div className="rounded-2xl border bg-white p-8 shadow-sm">
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={editData.full_name}
                      onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Telefon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="0555 123 4567"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Şehir
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Select
                        value={editData.city}
                        onChange={(e) =>
                          setEditData({ ...editData, city: e.target.value, district: "" })
                        }
                        className="pl-10"
                      >
                        <option value="">Şehir seçin</option>
                        {CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* District */}
                  {editData.city && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        İlçe
                      </label>
                      <Select
                        value={editData.district}
                        onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                      >
                        <option value="">İlçe seçin</option>
                        {DISTRICTS[editData.city]?.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}

                  {/* Address */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Adres
                    </label>
                    <Input
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      placeholder="Adresiniz"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 border-t pt-6">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </Button>
                    <Button
                      onClick={() => {
                        setEditData({
                          full_name: profile?.full_name || "",
                          phone: profile?.phone || "",
                          city: profile?.city || "",
                          district: profile?.district || "",
                          address: profile?.address || "",
                        });
                        setActiveTab("overview");
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      İptal
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
