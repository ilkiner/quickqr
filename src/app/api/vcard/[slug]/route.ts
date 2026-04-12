import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("vcard_profiles")
    .select("full_name, title, bio, email, phone, website")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  if (data.full_name) lines.push(`FN:${data.full_name}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.website) lines.push(`URL:${data.website}`);
  if (data.bio) lines.push(`NOTE:${(data.bio as string).replace(/\n/g, "\\n")}`);

  lines.push("END:VCARD");

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.vcf"`,
    },
  });
}
