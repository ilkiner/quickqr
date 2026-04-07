import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "src/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRO_PRICE_ID,
  business: process.env.STRIPE_BUSINESS_PRICE_ID,
};

export async function POST(req: Request) {
  const { plan } = (await req.json()) as { plan: string };

  if (!["pro", "business"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 500 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    metadata: { user_id: user.id, plan },
    success_url: `${origin}/dashboard?success=true`,
    cancel_url: `${origin}/pricing?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
