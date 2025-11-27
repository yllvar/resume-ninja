import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Resume Optimization
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Beat the ATS. <span className="text-primary">Land More Interviews.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Upload your resume and let our AI ninja transform it into an ATS-optimized masterpiece. Get instant
              analysis, keyword optimization, and multiple professional templates.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/optimize">
                  Optimize My Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Right content - Ninja mascot */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-primary/20 blur-2xl" />
              <Image
                src="/images/android-chrome-512x512.png"
                alt="Resume Ninja - Your AI Resume Optimizer"
                width={450}
                height={450}
                className="relative rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
