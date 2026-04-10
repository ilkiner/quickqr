import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data, error } = await supabase
    .from("qr_codes")
    .select("redirect_url, is_dynamic, scan_count")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }

  if (!data.is_dynamic || !data.redirect_url) {
    return NextResponse.json({ error: "Not a dynamic QR code" }, { status: 400 });
  }

  // Increment scan count (fire-and-forget)
  void supabase
    .from("qr_codes")
    .update({ scan_count: (data.scan_count ?? 0) + 1 })
    .eq("id", id)
    .then(() => {});

  return NextResponse.redirect(data.redirect_url, 302);
}
