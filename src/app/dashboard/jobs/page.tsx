import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 30;

export default async function DashboardJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Profil bilgilerini al
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/customer/register");
  }

  let jobs = [];

  if (profile.role === "provider") {
    // Provider için: Kendi ilindeki ve kategorilerine uygun ilanları göster
    const { data } = await supabase
      .from("jobs")
      .select(`
        *,
        customer:profiles!jobs_customer_id_fkey(full_name, city, district)
      `)
      .eq("city", profile.city)
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(20);

    jobs = data || [];
  } else {
    // Customer için: Kendi ilanlarını göster
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    jobs = data || [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {profile.role === "provider" ? "İş İlanları" : "İlanlarım"}
        </h1>
        <p className="mt-2 text-gray-600">
          {profile.role === "provider" 
            ? `${profile.city} ilindeki aktif iş ilanları` 
            : "Yayınladığınız iş ilanları"}
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <p className="text-gray-600">
            {profile.role === "provider" 
              ? `${profile.city} ilinde henüz aktif ilan bulunmuyor.` 
              : "Henüz ilan oluşturmadınız."}
          </p>
          {profile.role === "customer" && (
            <Link
              href="/jobs/new"
              className="mt-4 inline-block rounded-lg bg-sky-600 px-6 py-2 text-white hover:bg-sky-700"
            >
              İlk İlanınızı Oluşturun
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job: any) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block rounded-2xl border bg-white p-6 transition hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-gray-600">
                    {job.description}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                      {job.category}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                      📍 {job.city}, {job.district}
                    </span>
                    {job.budget && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                        💰 {job.budget} TL
                      </span>
                    )}
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-700">
                      {job.urgency === "urgent" ? "🔥 Acil" : "📅 Normal"}
                    </span>
                  </div>
                </div>

                {profile.role === "customer" && (
                  <div className="ml-4 text-right">
                    <span className={`inline-block rounded-full px-3 py-1 text-sm ${
                      job.status === "open" 
                        ? "bg-green-100 text-green-700" 
                        : job.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {job.status === "open" ? "Açık" : job.status === "in_progress" ? "Devam Ediyor" : "Tamamlandı"}
                    </span>
                  </div>
                )}
              </div>

              {profile.role === "provider" && job.customer && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-gray-600">
                    İlan Veren: <span className="font-medium text-gray-900">{job.customer.full_name}</span>
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

