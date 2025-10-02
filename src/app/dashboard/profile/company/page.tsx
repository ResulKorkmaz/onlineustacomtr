"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/types/database.types";
import { Phone, Mail, MapPin, Star, Edit, Save, X, Building2, FileText, Shield } from "lucide-react";

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
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

      // Şirket kontrolü
      if (profileData.provider_kind !== "company") {
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

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Şirket Profili</h1>
            {!editing ? (
              <Button onClick={() => setEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Düzenle
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button
                  onClick={() => {
                    if (!profile) return;
                    setEditing(false);
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
                  variant="ghost"
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  İptal
                </Button>
              </div>
            )}
          </div>

          {/* Verification Status */}
          {!profile.is_verified && (
            <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Doğrulama Bekleniyor</h3>
                  <p className="text-sm text-yellow-800">
                    Şirket belgeleriniz inceleniyor. Doğrulama tamamlandığında bildirim alacaksınız.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            {/* Company Logo and Name */}
            <div className="mb-8 flex items-start gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-100">
                <Building2 className="h-12 w-12 text-sky-600" />
              </div>
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Şirket Adı</label>
                      <Input
                        value={editData.company_name}
                        onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Yetkili Adı Soyadı</label>
                      <Input
                        value={editData.full_name}
                        onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="mb-1 text-2xl font-bold">{profile.company_name || "Şirket Adı"}</h2>
                    <p className="mb-3 text-gray-600">Yetkili: {profile.full_name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{profile.average_rating?.toFixed(1) || "Yeni"}</span>
                      </div>
                      <span>•</span>
                      <span>{profile.completed_jobs_count || 0} İş Tamamlandı</span>
                      {profile.is_verified && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">✓ Doğrulanmış Şirket</span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="mb-8 space-y-4">
              <h3 className="text-lg font-semibold">Şirket Bilgileri</h3>
              
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Vergi Numarası</label>
                    <Input
                      value={editData.tax_id}
                      onChange={(e) => setEditData({ ...editData, tax_id: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Telefon</label>
                    <Input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span>Vergi No: {profile.tax_id || "Belirtilmemiş"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{profile.phone || "Belirtilmemiş"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{profile.id}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>
                      {profile.city && profile.district
                        ? `${profile.district}, ${profile.city}`
                        : "Belirtilmemiş"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            {editing && (
              <div className="mb-8 space-y-3">
                <h3 className="text-lg font-semibold">Adres</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">İl</label>
                    <Input
                      value={editData.city}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">İlçe</label>
                    <Input
                      value={editData.district}
                      onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Company Description */}
            <div className="mb-8">
              <h3 className="mb-3 text-lg font-semibold">Şirket Hakkında</h3>
              {editing ? (
                <Textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={6}
                  placeholder="Şirketiniz ve hizmetleriniz hakkında bilgi verin..."
                />
              ) : (
                <p className="whitespace-pre-line text-gray-700">
                  {profile.bio || "Henüz şirket tanıtımı eklenmemiş"}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid gap-4 border-t pt-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold text-sky-600">
                  {profile.completed_jobs_count || 0}
                </div>
                <div className="text-sm text-gray-600">Tamamlanan Proje</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold text-sky-600">
                  {profile.average_rating?.toFixed(1) || "0.0"}
                </div>
                <div className="text-sm text-gray-600">Ortalama Puan</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold text-sky-600">
                  {profile.total_reviews_count || 0}
                </div>
                <div className="text-sm text-gray-600">Müşteri Yorumu</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Dashboard&apos;a Dön
            </Button>
            <Button onClick={() => router.push("/dashboard/jobs")} className="flex-1">
              Projeleri Görüntüle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

