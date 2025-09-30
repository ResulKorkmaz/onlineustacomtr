import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profil</h1>

      <div className="rounded-2xl border bg-white p-8">
        <h2 className="mb-4 text-xl font-bold">Profil Bilgileri</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">E-posta</label>
            <p className="mt-1">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Rol</label>
            <p className="mt-1 capitalize">{profile?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
