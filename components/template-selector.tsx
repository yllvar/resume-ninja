"use client"
import Image from "next/image"
import { TEMPLATES, type ResumeTemplate } from "@/lib/templates"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface TemplateSelectorProps {
  selectedTemplate: string
  onSelect: (templateId: string) => void
  userTier: string
}

export function TemplateSelector({ selectedTemplate, onSelect, userTier }: TemplateSelectorProps) {
  const tierOrder = { free: 0, pro: 1, enterprise: 2 }
  const userTierLevel = tierOrder[userTier as keyof typeof tierOrder] || 0

  const isTemplateAvailable = (template: ResumeTemplate) => {
    const templateTierLevel = tierOrder[template.tier as keyof typeof tierOrder] || 0
    return templateTierLevel <= userTierLevel
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {TEMPLATES.map((template) => {
        const available = isTemplateAvailable(template)
        const isSelected = selectedTemplate === template.id

        return (
          <Card
            key={template.id}
            className={cn(
              "relative cursor-pointer overflow-hidden transition-all",
              isSelected && "ring-2 ring-primary",
              !available && "opacity-60",
            )}
            onClick={() => available && onSelect(template.id)}
          >
            <CardContent className="p-0">
              {/* Preview Image */}
              <div className="relative aspect-[3/4] bg-muted">
                <Image src={template.preview || "/placeholder.svg"} alt={template.name} fill className="object-cover" />
                {!available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="text-center">
                      <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
                      <p className="mt-1 text-xs text-muted-foreground">Pro Only</p>
                    </div>
                  </div>
                )}
                {isSelected && (
                  <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{template.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {template.atsScore}% ATS
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{template.description}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
