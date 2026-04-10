import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "src/lib/supabase/server";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  const plan = profile?.plan ?? "free";
  if (plan !== "pro" && plan !== "business") {
    return NextResponse.json(
      { error: "Custom design is only available for Pro and Business plans." },
      { status: 403 }
    );
  }

  let body: {
    businessName: string;
    qrType: string;
    brandColors: string;
    notes: string;
    contactEmail: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { businessName, qrType, brandColors, notes, contactEmail } = body;

  if (!businessName?.trim() || !contactEmail?.trim()) {
    return NextResponse.json(
      { error: "Business name and contact email are required." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactEmail)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    await getResend().emails.send({
      from: "QuickQR Custom Design <onboarding@resend.dev>",
      to: "support@qrfast.dev",
      subject: `Custom QR Design Request — ${businessName}`,
      html: `
        <h2>New Custom QR Design Request</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e5e7eb">Business Name</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(businessName)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e5e7eb">QR Type</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(qrType)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e5e7eb">Brand Colors</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(brandColors || "Not specified")}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e5e7eb">Contact Email</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(contactEmail)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e5e7eb">Plan</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${plan}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Additional Notes</td><td style="padding:8px">${escapeHtml(notes || "None")}</td></tr>
        </table>
        <p style="margin-top:16px;color:#6b7280;font-size:14px">Logo was ${body ? "not attached (file uploads handled separately)" : "not provided"}.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json(
      { error: "Failed to send request. Please try again." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
