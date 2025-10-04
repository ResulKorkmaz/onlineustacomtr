"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { 
  Phone, Mail, MapPin, Edit, Save, X, Building2,
  TrendingUp, Settings, User, Briefcase, BadgeCheck, Star
} from "lucide-react";
import type { Profile } from "@/lib/types/database.types";

interface CompanyProfileClientProps {
  initialProfile: Profile;
  userEmail: string;
}

export default function CompanyProfileClient({ initialProfile, userEmail }: CompanyProfileClientProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "edit" | "verification">("overview");
  const router = useRouter();
  const supabase = createClient();

  const [editData, setEditData] = useState({
    company_name: profile.company_name || "",
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    bio: profile.bio || "",
    city: profile.city || "",
    district: profile.district || "",
    tax_id: profile.tax_id || "",
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
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-lg">
            <Building2 className="h-10 w-10" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">{profile.company_name || profile.full_name}</h3>
          <p className="text-sm text-gray-500">Şirket Hesabı</p>
          {profile.is_verified && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              <BadgeCheck className="h-3 w-3" />
              Doğrulanmış Şirket
            </div>
          )}
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={\`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition \${
              activeTab === "overview"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }\`}
          >
            <Building2 className="h-5 w-5" />
            <span>Firma Bilgileri</span>
          </button>
          
          <button
            onClick={() => setActiveTab("edit")}
            className={\`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition \${
              activeTab === "edit"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }\`}
          >
            <Edit className="h-5 w-5" />
            <span>Bilgileri Düzenle</span>
          </button>

          <button
            onClick={() => setActiveTab("verification")}
            className={\`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition \${
              activeTab === "verification"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }\`}
          >
            <BadgeCheck className="h-5 w-5" />
            <span>Firma Onayı</span>
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
            <span>İlanlar</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Firma Profilim</h1>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Firma Bilgileri</h2>
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
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                        Firma Bilgileri
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Building2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Firma Adı</p>
                            <p className="font-medium text-gray-900">
                              {profile.company_name || "Belirtilmemiş"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Yetkili Kişi</p>
                            <p className="font-medium text-gray-900">
                              {profile.full_name || "Belirtilmemiş"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                        İletişim Bilgileri
                      </h3>
                      <div className="space-y-3">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Card */}
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Firma Hakkında</h3>
                <p className="whitespace-pre-line leading-relaxed text-gray-700">
                  {profile.bio || "Henüz firma tanıtım metni eklenmemiş."}
                </p>
              </div>
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === "edit" && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b p-6">
                  <h2 className="text-xl font-bold text-gray-900">Firma Bilgilerini Düzenle</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Firma Adı
                      </label>
                      <Input
                        value={editData.company_name}
                        onChange={(e) =>
                          setEditData({ ...editData, company_name: e.target.value })
                        }
                        placeholder="Firma Adınız"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Yetkili Kişi
                      </label>
                      <Input
                        value={editData.full_name}
                        onChange={(e) =>
                          setEditData({ ...editData, full_name: e.target.value })
                        }
                        placeholder="Yetkili Adı Soyadı"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Telefon
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

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Firma Tanıtımı
                      </label>
                      <Textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        rows={6}
                        placeholder="Firmanızı tanıtın..."
                      />
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
                        onClick={() => setActiveTab("overview")}
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

          {/* Verification Tab */}
          {activeTab === "verification" && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b p-6">
                  <h2 className="text-xl font-bold text-gray-900">Firma Onayı</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Firmanızı onaylatarak güvenilirliğinizi artırın
                  </p>
                </div>

                <div className="p-6">
                  <div className="rounded-lg bg-indigo-50 p-8 text-center">
                    <BadgeCheck className="mx-auto h-16 w-16 text-indigo-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Firma Onayı Hizmeti
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Firmanızın güvenilirliğini artırın ve daha fazla müşteriye ulaşın
                    </p>
                    {profile.is_verified ? (
                      <div className="rounded-lg bg-green-100 p-4 text-green-700">
                        <BadgeCheck className="mx-auto h-8 w-8 mb-2" />
                        <p className="font-medium">Firmanız Onaylanmış!</p>
                      </div>
                    ) : (
                      <Button className="gap-2" size="lg">
                        <Star className="h-5 w-5" />
                        Firma Onayı Satın Al
                      </Button>
                    )}
                    <p className="text-sm text-gray-500 mt-4">
                      Yakında aktif olacak!
                    </p>
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
