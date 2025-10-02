"use client";

import { useState } from "react";
import { Shield, UserPlus, Edit, Trash2, AlertTriangle, X, Crown } from "lucide-react";
import { AdminRole } from "@/lib/admin/permissions";

interface Admin {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  admin_role: AdminRole;
  is_super_admin: boolean;
  created_at: string;
  last_login_at: string | null;
  created_by_admin: string | null;
}

interface Props {
  admins: Admin[];
  currentUserRole: AdminRole;
  isSuperAdmin: boolean;
}

export default function AdminManagementClient({
  admins,
  currentUserRole,
  isSuperAdmin,
}: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    role: "editor" as AdminRole,
  });

  const canCreateAdmin = isSuperAdmin || currentUserRole === "admin";
  const canDeleteAdmin = (admin: Admin) => {
    if (admin.is_super_admin) return false; // Super admin cannot be deleted
    if (!isSuperAdmin && admin.admin_role === "admin") return false; // Admin cannot delete other admins
    return true;
  };

  const handleCreateAdmin = async () => {
    if (!formData.email) {
      setError("Email gerekli");
      return;
    }

    // Admin can only create editors
    if (currentUserRole === "admin" && formData.role !== "editor") {
      setError("Admin yalnızca Editor oluşturabilir");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Admin oluşturulamadı");
      }

      setSuccess("Admin başarıyla oluşturuldu");
      setShowCreateModal(false);
      setFormData({ email: "", role: "editor" });
      
      // Refresh page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: selectedAdmin.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Admin silinemedi");
      }

      setSuccess("Admin başarıyla silindi");
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      
      // Refresh page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: AdminRole, isSuper: boolean) => {
    if (isSuper) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white">
          <Crown className="h-3 w-3" />
          Super Admin
        </span>
      );
    }

    const badges = {
      super_admin: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      admin: "bg-gradient-to-r from-blue-500 to-sky-500 text-white",
      editor: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    };

    const labels = {
      super_admin: "Super Admin",
      admin: "Admin",
      editor: "Editor",
    };

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${badges[role]}`}>
        <Shield className="h-3 w-3" />
        {labels[role]}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Yönetimi</h1>
          <p className="mt-2 text-gray-600">
            Admin ve editor kullanıcılarını yönetin
          </p>
        </div>

        {canCreateAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 font-medium text-white transition hover:from-sky-600 hover:to-blue-700"
          >
            <UserPlus className="h-5 w-5" />
            Yeni Admin Oluştur
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm font-medium text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Admin List */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">İşlemler</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold">
                        {admin.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {admin.full_name}
                        </p>
                        <p className="text-xs text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(admin.admin_role, admin.is_super_admin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.created_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.last_login_at
                      ? new Date(admin.last_login_at).toLocaleDateString("tr-TR")
                      : "Hiç giriş yapmadı"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {canDeleteAdmin(admin) ? (
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    ) : (
                      <span className="text-gray-300">
                        <Shield className="h-5 w-5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Yeni Admin Oluştur
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setError("");
                  }}
                  className="rounded-lg p-2 hover:bg-gray-100 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  disabled={currentUserRole === "admin"}
                >
                  {isSuperAdmin && (
                    <>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                    </>
                  )}
                  {currentUserRole === "admin" && (
                    <option value="editor">Editor</option>
                  )}
                </select>
                {currentUserRole === "admin" && (
                  <p className="mt-2 text-xs text-gray-500">
                    Admin yalnızca Editor oluşturabilir
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>

            <div className="border-t px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setError("");
                }}
                className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                İptal
              </button>
              <button
                onClick={handleCreateAdmin}
                disabled={loading}
                className="rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 font-medium text-white hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Oluşturuluyor..." : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Admin Modal */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="border-b px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Admin Sil
                </h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{selectedAdmin.full_name}</span> adlı admin'i silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>

            <div className="border-t px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAdmin(null);
                  setError("");
                }}
                className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteAdmin}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {loading ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

