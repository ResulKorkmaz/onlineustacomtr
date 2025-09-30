"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { 
  Phone, Mail, MapPin, Star, Edit, Save, X, 
  Briefcase, Award, CheckCircle, Clock, TrendingUp,
  Settings, User, Shield, Calendar
} from "lucide-react";

export default function IndividualProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "edit">("overview");
  const router = useRouter();
  const supabase = createClient();

  const [editData, setEditData] = useState({
    full_name: "",
    phone: "",
    bio: "",
    city: "",
    district: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      // Şahıs kontrolü
      if (profileData.provider_kind !== "individual") {
        router.push("/dashboard/profile/company");
        return;
      }

      setProfile(profileData);
      setEditData({
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        bio: profileData.bio || "",
        city: profileData.city || "",
        district: profileData.district || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(editData)
        .eq("id", profile.id);

      if (error) throw error;

      await loadProfile();
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Profil güncellenirken hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
            {/* Profile Header in Sidebar */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-3xl font-bold text-white shadow-lg">
                {profile.full_name?.charAt(0) || "?"}
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900">{profile.full_name}</h3>
              <p className="text-sm text-gray-500">Şahıs Hesabı</p>
              {profile.is_verified && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  Doğrulanmış
                </div>
              )}
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
                <span>Dashboard</span>
              </button>
            </nav>

            {/* Quick Stats in Sidebar */}
            <div className="mt-8 space-y-3 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Performans</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Başarı Oranı</span>
                <span className="font-bold text-sky-600">
                  {profile.completed_jobs_count > 0 ? "100%" : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Toplam İş</span>
                <span className="font-bold text-sky-600">{profile.completed_jobs_count || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mx-auto max-w-5xl p-6 lg:p-8">
            {/* Mobile Header */}
            <div className="mb-6 lg:hidden">
              <h1 className="text-2xl font-bold text-gray-900">Profilim</h1>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100">
                      <Briefcase className="h-6 w-6 text-sky-600" />
                    </div>
                    <div className="mb-1 text-3xl font-bold text-gray-900">
                      {profile.completed_jobs_count || 0}
                    </div>
                    <p className="text-sm text-gray-600">Tamamlanan İş</p>
                  </div>

                  <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="mb-1 text-3xl font-bold text-gray-900">
                      {profile.average_rating?.toFixed(1) || "0.0"}
                    </div>
                    <p className="text-sm text-gray-600">Ortalama Puan</p>
                  </div>

                  <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="mb-1 text-3xl font-bold text-gray-900">
                      {profile.total_reviews_count || 0}
                    </div>
                    <p className="text-sm text-gray-600">Toplam Yorum</p>
                  </div>
                </div>

                {/* Profile Info Card */}
                <div className="rounded-xl border bg-white shadow-sm">
                  <div className="border-b p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Profil Bilgileri</h2>
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
                      {/* Contact Info */}
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-gray-500">
                          <Phone className="h-4 w-4" />
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
                              <p className="font-medium text-gray-900">{profile.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location Info */}
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-gray-500">
                          <MapPin className="h-4 w-4" />
                          Konum Bilgileri
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Hizmet Bölgesi</p>
                              <p className="font-medium text-gray-900">
                                {profile.city && profile.district
                                  ? `${profile.district}, ${profile.city}`
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
                </div>

                {/* About Card */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Hakkımda</h3>
                  <p className="whitespace-pre-line leading-relaxed text-gray-700">
                    {profile.bio || "Henüz tanıtım metni eklenmemiş. Profilinizi düzenleyerek kendinizi tanıtabilirsiniz."}
                  </p>
                </div>

                {/* Activity Timeline (Placeholder) */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Son Aktiviteler</h3>
                  <div className="space-y-4">
                    {profile.completed_jobs_count > 0 ? (
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {profile.completed_jobs_count} iş başarıyla tamamlandı
                          </p>
                          <p className="text-sm text-gray-500">
                            Harika bir performans gösteriyorsunuz!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-100">
                          <Clock className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Henüz tamamlanmış iş yok</p>
                          <p className="text-sm text-gray-500">
                            İlk işinizi tamamlayarak deneyim kazanmaya başlayın
                          </p>
                        </div>
                      </div>
                    )}
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
                      Bilgilerinizi güncel tutarak daha fazla iş fırsatına ulaşın
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Personal Info */}
                      <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                          Kişisel Bilgiler
                        </h3>
                        <div className="space-y-4">
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
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                          Konum Bilgileri
                        </h3>
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
                      </div>

                      {/* Bio */}
                      <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                          Hakkınızda
                        </h3>
                        <Textarea
                          value={editData.bio}
                          onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                          rows={8}
                          placeholder="Deneyimleriniz, uzmanlık alanlarınız ve çalışma şekliniz hakkında bilgi verin..."
                          className="resize-none"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          Detaylı bir tanıtım metni, müşterilerin size güvenmesini sağlar
                        </p>
                      </div>

                      {/* Action Buttons */}
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
                              bio: profile.bio || "",
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
    </div>
  );
}

