"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

type Tier = {
  name: string
  price: string
  period: string
  features: string[]
  cta: React.ReactNode
  badge?: string
  highlight?: boolean
}

async function startCheckout(plan: "pro" | "agency") {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || "Failed to start checkout")
  }
  const { url } = await res.json()
  if (url) window.location.href = url
}

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<"pro" | "agency" | null>(null)

  const tiers: Tier[] = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: ["3 resume optimizations/month", "Basic ATS template", "PDF & DOCX download", "ATS score analysis"],
      cta: (
        <Button asChild variant="outline">
          <Link href="/auth/sign-up">Get Started Free</Link>
        </Button>
      ),
    },
    {
      name: "Pro",
      badge: "Most Popular",
      price: "$9",
      period: "/month",
      features: [
        "Unlimited optimizations",
        "5 premium ATS templates",
        "Job description tailoring",
        "Keyword optimization",
        "Priority processing",
        "Email support",
      ],
      cta: (
        <Button
          onClick={async () => {
            try {
              setLoadingPlan("pro")
              await startCheckout("pro")
            } finally {
              setLoadingPlan(null)
            }
          }}
          disabled={loadingPlan !== null}
        >
          {loadingPlan === "pro" ? "Redirecting..." : "Start Pro Trial"}
        </Button>
      ),
      highlight: true,
    },
    {
      name: "Agency",
      price: "$49",
      period: "/month",
      features: [
        "Everything in Pro",
        "Team accounts (5 seats)",
        "White-label exports",
        "Bulk processing",
        "API access",
        "Dedicated support",
      ],
      cta: (
        <Button
          variant="outline"
          onClick={async () => {
            try {
              setLoadingPlan("agency")
              await startCheckout("agency")
            } finally {
              setLoadingPlan(null)
            }
          }}
          disabled={loadingPlan !== null}
        >
          {loadingPlan === "agency" ? "Redirecting..." : "Contact Sales"}
        </Button>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/android-chrome-192x192.png" alt="Resume Ninja" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-foreground">Resume Ninja</span>
          </Link>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <Zap className="mr-2 h-4 w-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-foreground">Simple, Transparent Pricing</h1>
        <p className="mt-2 text-muted-foreground">Start for free, upgrade when you need more. Cancel anytime.</p>
      </section>

      {/* Tiers */}
      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-16 sm:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-xl border p-6 ${tier.highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}
          >
            {tier.badge && (
              <div className="mb-3 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                {tier.badge}
              </div>
            )}
            <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{tier.price}</span>
              <span className="text-muted-foreground">{tier.period}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">{tier.cta}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
