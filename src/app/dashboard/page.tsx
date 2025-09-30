import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: jobsCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", user.id);

  const { count: bidsCount } = await supabase
    .from("bids")
    .select("*", { count: "exact", head: true })
    .eq("provider_id", user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-600">Rolünüz</h3>
          <p className="mt-2 text-2xl font-bold capitalize">{profile?.role}</p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-600">
            {profile?.role === "customer" ? "İlanlarınız" : "Teklifleriniz"}
          </h3>
          <p className="mt-2 text-2xl font-bold">
            {profile?.role === "customer" ? jobsCount : bidsCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-600">Tamamlanan İşler</h3>
          <p className="mt-2 text-2xl font-bold">{profile?.completed_jobs_count}</p>
        </div>
      </div>
    </div>
  );
}
