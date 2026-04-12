import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function parseUserAgent(ua: string): {
  device_type: string;
  os: string;
  browser: string;
} {
  const u = ua.toLowerCase();

  // Device
  const isTablet = /ipad|tablet|(android(?!.*mobile))/i.test(ua);
  const isMobile = !isTablet && /mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua);
  const device_type = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

  // OS
  let os = "Other";
  if (/iphone|ipad|ipod/.test(u)) os = "iOS";
  else if (/android/.test(u)) os = "Android";
  else if (/windows/.test(u)) os = "Windows";
  else if (/macintosh|mac os x/.test(u)) os = "Mac";
  else if (/linux/.test(u)) os = "Linux";

  // Browser
  let browser = "Other";
  if (/instagram/.test(u)) browser = "Instagram";
  else if (/fban|fbav/.test(u)) browser = "Facebook";
  else if (/edg\//.test(u)) browser = "Edge";
  else if (/opr\/|opera/.test(u)) browser = "Opera";
  else if (/firefox/.test(u)) browser = "Firefox";
  else if (/chrome/.test(u)) browser = "Chrome";
  else if (/safari/.test(u)) browser = "Safari";

  return { device_type, os, browser };
}

export async function GET(
  req: NextRequest,
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

  const ua = req.headers.get("user-agent") ?? "";
  const { device_type, os, browser } = parseUserAgent(ua);

  // Fire-and-forget: increment scan count + log scan details
  void Promise.all([
    supabase
      .from("qr_codes")
      .update({ scan_count: (data.scan_count ?? 0) + 1 })
      .eq("id", id),
    supabase.from("qr_scans").insert({
      qr_code_id: id,
      user_agent: ua || null,
      device_type,
      os,
      browser,
    }),
  ]);

  return NextResponse.redirect(data.redirect_url, 302);
}
