import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { buildAuthUrl, pinterestConfigured } from "../../../../lib/pinterest";

// Starts the OAuth flow: verifies the MyAura user, sets a CSRF state cookie,
// and redirects to Pinterest's authorize screen.
export async function GET(request) {
  const { origin } = new URL(request.url);

  if (!pinterestConfigured()) {
    return NextResponse.redirect(`${origin}/pinterest?error=not_configured`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // CSRF state — random, stored in an httpOnly cookie and echoed by Pinterest
  const state = crypto.randomUUID();
  const authUrl = buildAuthUrl(state);

  const res = NextResponse.redirect(authUrl);
  res.cookies.set("pinterest_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });
  return res;
}
