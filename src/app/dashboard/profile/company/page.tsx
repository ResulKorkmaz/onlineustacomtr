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
  Settings, User, Calendar, Wallet, MessageSquare, 
  HelpCircle, UserCheck, Shield, LogOut, Building2,
  FileText, BadgeCheck, CreditCard
} from "lucide-react";
import type { Profile } from "@/lib/types/database.types";

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "edit" | "verification">("overview");
  const router = useRouter();
  const supabase = createClient();

  const [editData, setEditData] = useState({
    company_name: "",
    full_name: "",
    phone: "",
    bio: "",
    city: "",
    district: "",
    tax_id: "",
  });

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      console.log("🔍 Loading profile...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ User error:", userError);
        setLoading(false);
        return;
      }

      if (!user) {
        console.log("⚠️ No user, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("✅ User found:", user.email);
      setUserEmail(user.email || "");

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("❌ Profile error:", error);
        setLoading(false);
        return;
      }

      console.log("✅ Profile loaded:", profileData.provider_kind);

      // Şirket kontrolü
      if (profileData.provider_kind !== "company") {
        console.log("⚠️ Not a company profile, redirecting");
        router.push("/dashboard/profile/individual");
        return;
      }

      setProfile(profileData);
      setEditData({
        company_name: profileData.company_name || "",
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        bio: profileData.bio || "",
        city: profileData.city || "",
        district: profileData.district || "",
        tax_id: profileData.tax_id || "",
      });
      
      console.log("✅ Company profile set successfully");
      setLoading(false);
    } catch (error) {
      console.error("❌ Fatal error loading profile:", error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(editData)
        .eq("id", profile.id);

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
            {/* Profile Header in Sidebar */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg">
                <Building2 className="h-10 w-10" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900">{profile.company_name || "Şirket"}</h3>
              <p className="text-sm text-gray-500">Kurumsal Hesap</p>
              {profile.is_verified && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  Doğrulanmış Şirket
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
                onClick={() => setActiveTab("verification")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  activeTab === "verification"
                    ? "bg-sky-50 text-sky-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BadgeCheck className="h-5 w-5" />
                <span>Firma Onayı</span>
                {!profile.is_verified && (
                  <span className="ml-auto flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                  </span>
                )}
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
                <span className="text-sm text-gray-600">Toplam Proje</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Şirket Profilim</h1>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Verification Alert */}
                {!profile.is_verified && (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                        <Shield className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-yellow-900">
                          Firma Onayı Bekleniyor
                        </h3>
                        <p className="mb-4 text-sm text-yellow-800">
                          Doğrulanmış şirketler %300 daha fazla iş teklifi alıyor! Hemen firma onayı satın alın.
                        </p>
                        <Button
                          onClick={() => setActiveTab("verification")}
                          className="gap-2 bg-yellow-600 hover:bg-yellow-700"
                        >
                          <BadgeCheck className="h-4 w-4" />
                          Firma Onayı Al
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100">
                      <Briefcase className="h-6 w-6 text-sky-600" />
                    </div>
                    <div className="mb-1 text-3xl font-bold text-gray-900">
                      {profile.completed_jobs_count || 0}
                    </div>
                    <p className="text-sm text-gray-600">Tamamlanan Proje</p>
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
                    <p className="text-sm text-gray-600">Müşteri Yorumu</p>
                  </div>
                </div>

                {/* Profile Info Card */}
                <div className="rounded-xl border bg-white shadow-sm">
                  <div className="border-b p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Şirket Bilgileri</h2>
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
                      {/* Company Info */}
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-gray-500">
                          <Building2 className="h-4 w-4" />
                          Şirket Detayları
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Building2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Şirket Adı</p>
                              <p className="font-medium text-gray-900">
                                {profile.company_name || "Belirtilmemiş"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Vergi Numarası</p>
                              <p className="font-medium text-gray-900">
                                {profile.tax_id || "Belirtilmemiş"}
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
                              <p className="font-medium text-gray-900">{userEmail}</p>
                            </div>
                          </div>
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Card */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Şirket Hakkında</h3>
                  <p className="whitespace-pre-line leading-relaxed text-gray-700">
                    {profile.bio || "Henüz şirket tanıtımı eklenmemiş. Profilinizi düzenleyerek şirketinizi tanıtabilirsiniz."}
                  </p>
                </div>

                {/* Activity Timeline */}
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
                            {profile.completed_jobs_count} proje başarıyla tamamlandı
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
                          <p className="font-medium text-gray-900">Henüz tamamlanmış proje yok</p>
                          <p className="text-sm text-gray-500">
                            İlk projenizi tamamlayarak portföyünüzü oluşturmaya başlayın
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
                    <h2 className="text-xl font-bold text-gray-900">Şirket Bilgilerini Düzenle</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Bilgilerinizi güncel tutarak daha fazla iş fırsatına ulaşın
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Company Info */}
                      <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                          Şirket Bilgileri
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Şirket Adı
                            </label>
                            <Input
                              value={editData.company_name}
                              onChange={(e) =>
                                setEditData({ ...editData, company_name: e.target.value })
                              }
                              placeholder="Şirket Ünvanı"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Vergi Numarası
                            </label>
                            <Input
                              value={editData.tax_id}
                              onChange={(e) =>
                                setEditData({ ...editData, tax_id: e.target.value })
                              }
                              placeholder="10 haneli vergi numarası"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Yetkili Adı Soyadı
                            </label>
                            <Input
                              value={editData.full_name}
                              onChange={(e) =>
                                setEditData({ ...editData, full_name: e.target.value })
                              }
                              placeholder="Şirket yetkilisi"
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
                          Şirket Hakkında
                        </h3>
                        <Textarea
                          value={editData.bio}
                          onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                          rows={8}
                          placeholder="Şirketiniz, hizmetleriniz, referanslarınız ve çalışma prensipleriniz hakkında detaylı bilgi verin..."
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
                              company_name: profile.company_name || "",
                              full_name: profile.full_name || "",
                              phone: profile.phone || "",
                              bio: profile.bio || "",
                              city: profile.city || "",
                              district: profile.district || "",
                              tax_id: profile.tax_id || "",
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

            {/* Verification Tab */}
            {activeTab === "verification" && (
              <div className="space-y-6">
                <div className="rounded-xl border bg-white shadow-sm">
                  <div className="border-b p-6">
                    <h2 className="text-xl font-bold text-gray-900">Firma Onayı</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Doğrulanmış firmalar daha fazla güven kazanır ve %300 daha fazla iş teklifi alır
                    </p>
                  </div>

                  <div className="p-6">
                    {profile.is_verified ? (
                      <div className="rounded-lg bg-green-50 p-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                          <BadgeCheck className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-green-900">
                          Şirketiniz Doğrulanmış!
                        </h3>
                        <p className="text-green-700">
                          Profilinizde doğrulanmış firma rozeti görünüyor
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Benefits */}
                        <div>
                          <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Firma Onayı Avantajları
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">%300 Daha Fazla İş Teklifi</p>
                                <p className="text-sm text-gray-600">
                                  Müşteriler doğrulanmış firmaları tercih ediyor
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Öncelikli Listeleme</p>
                                <p className="text-sm text-gray-600">
                                  Arama sonuçlarında üst sıralarda görünün
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Güvenilir İmaj</p>
                                <p className="text-sm text-gray-600">
                                  Profilinizde özel doğrulanmış rozeti
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Premium Destek</p>
                                <p className="text-sm text-gray-600">
                                  7/24 öncelikli müşteri desteği
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50 p-8">
                          <div className="mb-6 text-center">
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-700">
                              <BadgeCheck className="h-4 w-4" />
                              En Popüler
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900">
                              Firma Onayı Paketi
                            </h3>
                            <div className="flex items-baseline justify-center gap-2">
                              <span className="text-5xl font-bold text-sky-600">₺499</span>
                              <span className="text-gray-600">/yıllık</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              Tek seferlik ödeme, 12 ay geçerli
                            </p>
                          </div>

                          <Button
                            size="lg"
                            className="w-full gap-2 bg-gradient-to-r from-sky-600 to-blue-600 text-lg font-semibold shadow-lg hover:from-sky-700 hover:to-blue-700"
                          >
                            <CreditCard className="h-5 w-5" />
                            Firma Onayı Satın Al
                          </Button>

                          <p className="mt-4 text-center text-xs text-gray-600">
                            Güvenli ödeme • 14 gün para iade garantisi
                          </p>
                        </div>

                        {/* Documents Required */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                          <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Gerekli Belgeler
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <span>•</span>
                              <span>Ticaret Sicil Gazetesi veya Şirket Kuruluş Belgesi</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span>•</span>
                              <span>Vergi Levhası</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span>•</span>
                              <span>İmza Sirküleri</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span>•</span>
                              <span>Yetkili Kimlik Fotokopisi</span>
                            </li>
                          </ul>
                          <p className="mt-4 text-xs text-gray-500">
                            * Belgeler ödeme sonrası yüklenebilir
                          </p>
                        </div>
                      </div>
                    )}
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
