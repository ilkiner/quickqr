import { createClient } from "src/lib/supabase/server";
import { safeRedirectTarget } from "src/lib/auth/safe-redirect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as
    | "signup"
    | "magiclink"
    | "invite"
    | "recovery"
    | "email_change"
    | null;
  const next = searchParams.get("next");

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      const path = safeRedirectTarget(next, request);
      return NextResponse.redirect(new URL(path, request.url));
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}
