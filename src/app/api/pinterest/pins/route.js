import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getValidToken, pinterestFetch } from "../../../../lib/pinterest";

// Returns pins from a given board. Token stays server-side.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("board_id");
  if (!boardId) return NextResponse.json({ error: "board_id_required" }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const token = await getValidToken(supabase, user.id);
  if (!token) return NextResponse.json({ error: "not_connected" }, { status: 400 });

  const res = await pinterestFetch(`/boards/${encodeURIComponent(boardId)}/pins?page_size=50`, token);
  if (res.status === 401) return NextResponse.json({ error: "needs_reconnect" }, { status: 401 });
  if (!res.ok) return NextResponse.json({ error: "pinterest_error" }, { status: 502 });

  const data = await res.json();
  const pins = (data.items ?? []).map((p) => {
    // Pinterest returns images keyed by size — pick the largest available
    const images = p.media?.images ?? {};
    const image =
      images["600x"]?.url ||
      images["400x300"]?.url ||
      images["1200x"]?.url ||
      Object.values(images)[0]?.url ||
      null;
    return {
      id: p.id,
      title: p.title || p.grid_title || null,
      description: p.description || null,
      image,
      link: `https://www.pinterest.com/pin/${p.id}/`,
    };
  });
  return NextResponse.json({ pins });
}
