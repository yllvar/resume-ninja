import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { TIER_LIMITS, type SubscriptionTier } from "@/lib/supabase/types"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeSecret = process.env.STRIPE_SECRET_KEY

  if (!sig || !webhookSecret || !stripeSecret) {
    return NextResponse.json({ error: "Missing Stripe configuration" }, { status: 500 })
  }

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    const stripe = new Stripe(stripeSecret)
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed.", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const plan = (session.metadata?.plan as "pro" | "agency" | undefined) || "pro"
        if (!userId) break

        const supabase = createAdminClient()
        const tier: SubscriptionTier = plan === "agency" ? "enterprise" : "pro"

        // Set subscription tier
        const updates: Record<string, any> = { subscription_tier: tier, updated_at: new Date().toISOString() }

        // Optionally set monthly credits on upgrade (pro only - enterprise is unlimited)
        const creditsPerMonth = TIER_LIMITS[tier].creditsPerMonth
        if (Number.isFinite(creditsPerMonth)) {
          updates.credits = creditsPerMonth
        }

        await supabase.from("profiles").update(updates).eq("id", userId)
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        // In a fuller implementation, map Stripe customer -> user, then set/clear tiers.
        // Skipped here to keep the example concise since we rely on checkout metadata.
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error("Webhook handling error", e)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
