import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function BalancePage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Bütçem</h1>
      </div>

      {/* Placeholder Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
            <svg
              className="h-8 w-8 text-sky-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Bütçe Yönetimi</h2>
          <div className="rounded-lg bg-gray-50 p-6">
            <div className="text-3xl font-bold text-gray-900">₺0,00</div>
            <p className="mt-1 text-sm text-gray-600">Mevcut Bakiye</p>
          </div>
          <p className="text-sm text-gray-500">
            Bu sayfa yakında aktif olacak! Kazançlarınızı, ödemelerinizi ve bakiyenizi burada yönetebileceksiniz.
          </p>
        </div>
      </div>
    </div>
  );
}

