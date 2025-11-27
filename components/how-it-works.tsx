import { Upload, Cpu, Download, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Resume",
    description: "Drag and drop your existing resume in PDF or DOCX format. We support all standard resume formats.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description:
      "Our ninja AI analyzes your resume in seconds, scoring ATS compatibility and identifying improvements.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download & Apply",
    description:
      "Get your optimized resume in multiple formats. Apply with confidence knowing you'll pass ATS filters.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How Resume Ninja Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Three simple steps to transform your resume into an ATS-beating machine.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-6">
                <span className="text-sm font-semibold text-primary">{item.step}</span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-muted-foreground">{item.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="absolute top-8 -right-4 hidden h-6 w-6 text-border md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
