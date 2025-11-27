import type { OptimizedResume } from "@/lib/ai/schemas"
import { generateClassicHTML, generateClassicText } from "./classic"
import { generateModernHTML } from "./modern"
import { generateExecutiveHTML } from "./executive"
import { generateTechnicalHTML } from "./technical"

export type TemplateId = "classic" | "modern" | "executive" | "technical"
export type OutputFormat = "html" | "text" | "pdf"

export function generateResume(resume: Partial<OptimizedResume>, templateId: TemplateId, format: OutputFormat): string {
  if (format === "text") {
    // Only classic template has text version, others fall back to classic text
    return generateClassicText(resume)
  }

  // HTML generation based on template
  switch (templateId) {
    case "modern":
      return generateModernHTML(resume)
    case "executive":
      return generateExecutiveHTML(resume)
    case "technical":
      return generateTechnicalHTML(resume)
    case "classic":
    default:
      return generateClassicHTML(resume)
  }
}

export function downloadResume(content: string, fileName: string, format: OutputFormat) {
  const mimeTypes = {
    html: "text/html",
    text: "text/plain",
    pdf: "text/html", // PDF uses HTML then print
  }

  const extensions = {
    html: ".html",
    text: ".txt",
    pdf: ".html",
  }

  const blob = new Blob([content], { type: mimeTypes[format] })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${fileName}${extensions[format]}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function printResume(html: string) {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}
