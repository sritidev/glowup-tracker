import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getValidToken, pinterestFetch } from "../../../../lib/pinterest";

// Returns the user's Pinterest boards. Token stays server-side.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const token = await getValidToken(supabase, user.id);
  if (!token) return NextResponse.json({ error: "not_connected" }, { status: 400 });

  const res = await pinterestFetch("/boards?page_size=50", token);
  if (res.status === 401) return NextResponse.json({ error: "needs_reconnect" }, { status: 401 });
  if (!res.ok) return NextResponse.json({ error: "pinterest_error" }, { status: 502 });

  const data = await res.json();
  const boards = (data.items ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    pinCount: b.pin_count ?? null,
    image: b.media?.image_cover_url ?? null,
  }));
  return NextResponse.json({ boards });
}
