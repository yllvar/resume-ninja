import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStripe, getPriceId } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    const plan = body?.plan as "pro" | "agency"
    if (!plan || (plan !== "pro" && plan !== "agency")) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const stripe = getStripe()
    const price = getPriceId(plan)
    if (!price) {
      return NextResponse.json({ error: "Price ID not configured" }, { status: 500 })
    }

    const origin = new URL(req.url).origin

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      customer_email: user.email || undefined,
      success_url: `${origin}/dashboard?upgraded=1`,
      cancel_url: `${origin}/pricing?canceled=1`,
      metadata: {
        user_id: user.id,
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error("Checkout error", e)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
