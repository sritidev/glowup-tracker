import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { exchangeCodeForToken, pinterestFetch } from "../../../../lib/pinterest";

// Pinterest redirects here after the user authorizes (or cancels).
export async function GET(request) {
  const { origin, searchParams } = new URL(request.url);
  const done = (params) => NextResponse.redirect(`${origin}/pinterest?${params}`);

  const code       = searchParams.get("code");
  const state       = searchParams.get("state");
  const oauthError  = searchParams.get("error");

  // User cancelled or Pinterest returned an error
  if (oauthError) return done("error=cancelled");
  if (!code)      return done("error=cancelled");

  // Verify CSRF state
  const cookieState = request.cookies.get("pinterest_oauth_state")?.value;
  if (!cookieState || !state || cookieState !== state) {
    return done("error=invalid_state");
  }

  // Must be a logged-in MyAura user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  try {
    const tokens = await exchangeCodeForToken(code);
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    // Fetch the Pinterest account info (best-effort)
    let pinterestUserId = null, username = null;
    try {
      const meRes = await pinterestFetch("/user_account", tokens.access_token);
      if (meRes.ok) {
        const me = await meRes.json();
        username = me.username ?? null;
        pinterestUserId = me.id ?? me.username ?? null;
      }
    } catch { /* non-fatal */ }

    // Upsert the connection (one row per MyAura user)
    const { error } = await supabase.from("pinterest_connections").upsert({
      user_id: user.id,
      pinterest_user_id: pinterestUserId,
      username,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      scope: tokens.scope ?? null,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (error) return done("error=save_failed");

    const res = done("connected=1");
    res.cookies.delete("pinterest_oauth_state");
    return res;
  } catch {
    return done("error=auth_failed");
  }
}
