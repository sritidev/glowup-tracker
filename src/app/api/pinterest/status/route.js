import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { pinterestConfigured } from "../../../../lib/pinterest";

// Returns whether the current user has a Pinterest connection.
// Never returns tokens to the browser.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: conn } = await supabase
    .from("pinterest_connections")
    .select("username, created_at")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    configured: pinterestConfigured(),
    connected: Boolean(conn),
    username: conn?.username ?? null,
    connectedAt: conn?.created_at ?? null,
  });
}
