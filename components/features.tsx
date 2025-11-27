import { FileSearch, Target, Download, BarChart3, FileText, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: FileSearch,
    title: "Smart Parsing",
    description: "Upload PDF or DOCX files. Our AI extracts and analyzes every section of your resume.",
  },
  {
    icon: BarChart3,
    title: "ATS Score Analysis",
    description: "Get a detailed compatibility score (0-100%) with specific improvement recommendations.",
  },
  {
    icon: Target,
    title: "Keyword Optimization",
    description: "Match your resume to job descriptions with intelligent keyword injection and prioritization.",
  },
  {
    icon: Lightbulb,
    title: "AI Suggestions",
    description: "Receive actionable insights to enhance bullet points, quantify achievements, and more.",
  },
  {
    icon: FileText,
    title: "Multiple Templates",
    description: "Choose from 5+ ATS-proven templates designed to pass any applicant tracking system.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download your optimized resume in PDF and DOCX formats, ready for any application.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Beat the ATS
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our AI-powered toolkit ensures your resume gets past automated filters and into human hands.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
