import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware için Supabase client
 * Auth state'i günceller
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Session'ı yenile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Korumalı rotalarda auth kontrolü
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Admin paneli auth kontrolü
  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", "admin");
    return NextResponse.redirect(redirectUrl);
  }

  // Profil kontrolü yapılmayacak sayfalar
  const skipProfileCheck = [
    "/customer/register",
    "/provider/register",
    "/login",
    "/signup",
    "/admin", // Admin paneli kendi authorization'ını yapıyor
    "/api/",
    "/_next/",
    "/favicon.ico"
  ];

  const shouldSkipProfileCheck = skipProfileCheck.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Onboarding kontrolü - eğer profil yoksa yönlendir
  if (user && !shouldSkipProfileCheck) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, admin_role")
      .eq("id", user.id)
      .single();

    // Hata varsa ve "not found" değilse logla
    if (profileError && profileError.code !== "PGRST116") {
      console.error("[Middleware] Profile fetch error:", profileError);
    }

    // Profil yoksa customer register'a yönlendir
    // AMA admin kullanıcıları hariç
    if (!profile) {
      const registerUrl = request.nextUrl.clone();
      registerUrl.pathname = "/customer/register";
      return NextResponse.redirect(registerUrl);
    }
  }

  return supabaseResponse;
}
