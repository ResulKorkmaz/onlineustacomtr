"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { 
  Phone, Mail, MapPin, Edit, Save, X, User, Briefcase, 
  Calendar
} from "lucide-react";
import type { Profile } from "@/lib/types/database.types";

interface CustomerProfileClientProps {
  initialProfile: Profile;
  userEmail: string;
}

export default function CustomerProfileClient({ initialProfile, userEmail }: CustomerProfileClientProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const router = useRouter();
  const supabase = createClient();

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          city: profile.city,
          district: profile.district,
        })
        .eq("id", profile.id);

      if (error) throw error;
      
      setIsEditing(false);
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      alert("Profil güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { href: "/dashboard/profile/customer", label: "Profil Özeti", icon: User, active: true },
    { href: "#", label: "Bilgileri Düzenle", icon: Edit, active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-6">Müşteri Profili</h2>
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? "bg-sky-50 text-sky-600 border border-sky-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Hızlı Erişim</h3>
                <div className="space-y-2">
                  <a
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-600"
                  >
                    <Briefcase className="h-4 w-4" />
                    Ana Sayfa
                  </a>
                  <a
                    href="/dashboard/jobs"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-600"
                  >
                    <Calendar className="h-4 w-4" />
                    İlanlarım
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Profil Özeti</h1>
                    <p className="text-gray-600 mt-1">Müşteri bilgilerinizi görüntüleyin ve düzenleyin</p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditing ? "İptal" : "Düzenle"}
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Adresi
                    </label>
                    <Input
                      value={userEmail}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Ad Soyad
                    </label>
                    <Input
                      value={profile.full_name || ""}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefon
                    </label>
                    <Input
                      value={profile.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Şehir
                    </label>
                    <Input
                      value={profile.city || ""}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                    />
                  </div>

                  {/* District */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      İlçe
                    </label>
                    <Input
                      value={profile.district || ""}
                      onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex justify-end gap-3">
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      İptal
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
