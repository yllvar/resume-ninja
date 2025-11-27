"use client"

import { useState } from "react"
import type { OptimizedResume } from "@/lib/ai/schemas"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, FileDown, Printer, Check } from "lucide-react"
import { generatePlainTextResume, generateHTMLResume, downloadFile, printAsPDF } from "@/lib/resume-generator"

interface ResumeDownloaderProps {
  resume: Partial<OptimizedResume>
  fileName: string
  onClose: () => void
}

export function ResumeDownloader({ resume, fileName, onClose }: ResumeDownloaderProps) {
  const [downloaded, setDownloaded] = useState<string | null>(null)

  const baseName = fileName.replace(/\.[^/.]+$/, "") + "_optimized"

  const handleDownloadTXT = () => {
    const content = generatePlainTextResume(resume)
    downloadFile(content, `${baseName}.txt`, "text/plain")
    setDownloaded("txt")
  }

  const handleDownloadHTML = () => {
    const content = generateHTMLResume(resume)
    downloadFile(content, `${baseName}.html`, "text/html")
    setDownloaded("html")
  }

  const handlePrintPDF = () => {
    const html = generateHTMLResume(resume)
    printAsPDF(html)
    setDownloaded("pdf")
  }

  const downloadOptions = [
    {
      id: "txt",
      title: "Plain Text (.txt)",
      description: "Simple text format, universal compatibility",
      icon: FileText,
      action: handleDownloadTXT,
    },
    {
      id: "html",
      title: "HTML Document",
      description: "Formatted document you can edit in any browser",
      icon: FileDown,
      action: handleDownloadHTML,
    },
    {
      id: "pdf",
      title: "Print as PDF",
      description: "Opens print dialog to save as PDF",
      icon: Printer,
      action: handlePrintPDF,
    },
  ]

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Optimized Resume</DialogTitle>
          <DialogDescription>Choose your preferred format to download your ATS-optimized resume.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {downloadOptions.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className="h-auto justify-start p-4 bg-transparent"
              onClick={option.action}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  {downloaded === option.id ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <option.icon className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
