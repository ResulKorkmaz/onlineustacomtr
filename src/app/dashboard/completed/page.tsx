import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function CompletedJobsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/customer/register");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tamamlanan İşler</h1>
      </div>

      {/* Placeholder Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Tamamlanan İşler</h2>
          <p className="text-gray-600">
            Henüz tamamlanmış bir işiniz bulunmuyor.
          </p>
          <p className="text-sm text-gray-500">
            Bu sayfa yakında aktif olacak! Tamamladığınız tüm işleri burada görebileceksiniz.
          </p>
        </div>
      </div>
    </div>
  );
}

