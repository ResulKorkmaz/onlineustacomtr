"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { 
  Phone, Mail, MapPin, Edit, Save, X, User, Briefcase, 
  Star, TrendingUp, Settings, Calendar
} from "lucide-react";
import type { Profile } from "@/lib/types/database.types";

interface CustomerProfileClientProps {
  initialProfile: Profile;
  userEmail: string;
}

export default function CustomerProfileClient({ initialProfile, userEmail }: CustomerProfileClientProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "edit">("overview");
  const router = useRouter();
  const supabase = createClient();

  const [editData, setEditData] = useState({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    city: profile.city || "",
    district: profile.district || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(editData)
        .eq("id", profile.id);

      if (error) throw error;

      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();

      if (updatedProfile) {
        setProfile(updatedProfile);
      }

      setActiveTab("overview");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Profil güncellenirken hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full border-r bg-white p-6 lg:w-64">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-3xl font-bold text-white shadow-lg">
            {profile.full_name?.charAt(0) || "?"}
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">{profile.full_name}</h3>
          <p className="text-sm text-gray-500">Müşteri Hesabı</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={\`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition \${
              activeTab === "overview"
                ? "bg-green-50 text-green-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }\`}
          >
            <User className="h-5 w-5" />
            <span>Profil Özeti</span>
          </button>
          
          <button
            onClick={() => setActiveTab("edit")}
            className={\`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition \${
              activeTab === "edit"
                ? "bg-green-50 text-green-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }\`}
          >
            <Edit className="h-5 w-5" />
            <span>Bilgileri Düzenle</span>
          </button>

          <div className="my-4 border-t"></div>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Ana Sayfa</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/jobs")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <Briefcase className="h-5 w-5" />
            <span>İlanlarım</span>
          </button>

          <button
            onClick={() => router.push("/dashboard/settings")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50"
          >
            <Settings className="h-5 w-5" />
            <span>Ayarlar</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Müşteri Profilim</h1>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Kişisel Bilgiler</h2>
                    <Button
                      onClick={() => setActiveTab("edit")}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Düzenle
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Telefon</p>
                        <p className="font-medium text-gray-900">
                          {profile.phone || "Belirtilmemiş"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">E-posta</p>
                        <p className="font-medium text-gray-900">{userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Konum</p>
                        <p className="font-medium text-gray-900">
                          {profile.city && profile.district
                            ? \`\${profile.district}, \${profile.city}\`
                            : "Belirtilmemiş"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Kayıt Tarihi</p>
                        <p className="font-medium text-gray-900">
                          {new Date(profile.created_at).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === "edit" && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b p-6">
                  <h2 className="text-xl font-bold text-gray-900">Profil Bilgilerini Düzenle</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Bilgilerinizi güncel tutun
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Ad Soyad
                      </label>
                      <Input
                        value={editData.full_name}
                        onChange={(e) =>
                          setEditData({ ...editData, full_name: e.target.value })
                        }
                        placeholder="Adınız ve Soyadınız"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Telefon Numarası
                      </label>
                      <Input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="05XX XXX XX XX"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">İl</label>
                        <Input
                          value={editData.city}
                          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                          placeholder="Şehir"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          İlçe
                        </label>
                        <Input
                          value={editData.district}
                          onChange={(e) =>
                            setEditData({ ...editData, district: e.target.value })
                          }
                          placeholder="İlçe"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 border-t pt-6">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                      </Button>
                      <Button
                        onClick={() => {
                          setActiveTab("overview");
                          setEditData({
                            full_name: profile.full_name || "",
                            phone: profile.phone || "",
                            city: profile.city || "",
                            district: profile.district || "",
                          });
                        }}
                        variant="outline"
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        İptal
                      </Button>
                    </div>
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
