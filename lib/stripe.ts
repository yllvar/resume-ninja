import Stripe from "stripe"

// Initialize Stripe with secret key from env
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY")
  return new Stripe(key)
}

export function getPriceId(plan: "pro" | "agency") {
  if (plan === "pro") return process.env.PRICE_PRO_MONTHLY
  return process.env.PRICE_AGENCY_MONTHLY
}
