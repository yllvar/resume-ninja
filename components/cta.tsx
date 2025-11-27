import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="px-6 py-16 text-center sm:px-12 sm:py-20">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Ready to Transform Your Resume?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join thousands of job seekers who have increased their interview callbacks with AI-optimized resumes.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/optimize">
                  Start Free Optimization
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Your first optimization is free.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
