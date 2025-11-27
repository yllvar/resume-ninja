import { Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CreditsBadgeProps {
  credits: number
  tier: string
}

export function CreditsBadge({ credits, tier }: CreditsBadgeProps) {
  const isLow = credits <= 1 && tier !== "enterprise"

  return (
    <Badge variant="outline" className={cn("gap-1.5 px-3 py-1", isLow && "border-destructive/50 text-destructive")}>
      <Coins className="h-3.5 w-3.5" />
      <span className="font-medium">{tier === "enterprise" ? "Unlimited" : `${credits} credits`}</span>
    </Badge>
  )
}
