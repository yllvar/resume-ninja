"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function JobDescriptionInput({ value, onChange, className }: JobDescriptionInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Add Job Description</p>
            <p className="text-sm text-muted-foreground">Optional: Tailor your resume to a specific job</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border p-4">
          <Label htmlFor="job-description" className="sr-only">
            Job Description
          </Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here to get tailored keyword recommendations..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[150px] resize-none bg-background"
          />
          {value && (
            <div className="mt-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => onChange("")}>
                Clear
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
