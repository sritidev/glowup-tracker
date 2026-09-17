import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do NOT add logic between these two lines
  const { data: { user } } = await supabase.auth.getUser();

  const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/auth/callback"];
  const PUBLIC_FILES = ["/manifest.webmanifest", "/sw.js"];
  const pathname = request.nextUrl.pathname;
  // The intro/landing page "/" is public too
  const isIntro = pathname === "/";
  // "/privacy" is a public legal page — viewable by everyone, logged in or not
  const isLegal = pathname === "/privacy";
  // API routes handle their own auth (return JSON 401) — never redirect them to /login
  const isApi = pathname.startsWith("/api/");
  const isPublic = isIntro || isLegal || isApi || PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || PUBLIC_FILES.includes(pathname);

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Logged-in users skip intro/login/register — go straight to the app (but NOT /privacy)
  if (user && (isIntro || pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
