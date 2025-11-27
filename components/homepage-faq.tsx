"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from "lucide-react"

interface FAQItemProps {
  question: string
  children: React.ReactNode
  index: number
  defaultOpen?: boolean
}

const FAQItem = ({ question, children, index, defaultOpen = false }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-border/40 pb-4 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-3 font-medium hover:text-primary transition-colors"
        aria-expanded={isOpen}
        aria-controls={`home-faq-content-${index}`}
        id={`home-faq-question-${index}`}
      >
        <span className="text-lg">{question}</span>
        {isOpen ? <ChevronDown className="h-5 w-5 flex-shrink-0" /> : <ChevronRight className="h-5 w-5 flex-shrink-0" />}
      </button>
      <div 
        id={`home-faq-content-${index}`}
        role="region"
        aria-labelledby={`home-faq-question-${index}`}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pb-2 text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}

export function HomepageFAQ() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Resume Ninja and how we help you land more interviews.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle className="text-xl text-center">Quick Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <FAQItem
                question="What is Resume Ninja and how does it work?"
                index={0}
                defaultOpen
              >
                <p className="mb-3">
                  Resume Ninja is the <strong>world's first AI-powered resume optimization platform</strong> that guarantees <strong>98%+ ATS compatibility</strong>.
                </p>
                <p className="mb-3">
                  Our 4-step process takes just 12 seconds:
                </p>
                <ol className="list-decimal pl-5 space-y-1 mb-3">
                  <li>Upload any resume (PDF/DOCX)</li>
                  <li>AI analyzes and scores ATS compatibility</li>
                  <li>Converts to 7+ ATS-proof templates</li>
                  <li>Download optimized versions</li>
                </ol>
                <p>
                  <strong>Real results:</strong> 2-5% → 40-60% response rate
                </p>
              </FAQItem>

              <FAQItem
                question="Is Resume Ninja really free to try?"
                index={1}
              >
                <p className="mb-3">
                  Yes! You get <strong>3 free resume optimizations</strong> when you sign up - no credit card required.
                </p>
                <p className="mb-3">
                  After your free optimizations, our Pro plan is just <strong>$9/month</strong> for unlimited optimizations, advanced features, and priority support.
                </p>
                <p>
                  We also offer a <strong>30-day money-back guarantee</strong> - if you don't get 3+ interviews in the first month, we'll refund you completely.
                </p>
              </FAQItem>

              <FAQItem
                question="Which ATS systems do you support?"
                index={2}
              >
                <p className="mb-3">
                  We support <strong>99% of ATS systems</strong> used by companies today, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-3">
                  <li>Workday (35% market share)</li>
                  <li>Taleo/Oracle (22% market share)</li>
                  <li>iCIMS (15% market share)</li>
                  <li>Greenhouse (12% market share)</li>
                  <li>And many more...</li>
                </ul>
                <p>
                  We test against real ATS systems weekly to ensure maximum compatibility.
                </p>
              </FAQItem>

              <FAQItem
                question="Will my resume still look professional to humans?"
                index={3}
              >
                <p className="mb-3">
                  Absolutely! We create <strong>dual-optimized resumes</strong> that work for both ATS systems and human recruiters.
                </p>
                <p className="mb-3">
                  You get both an <strong>ATS-optimized version</strong> (plain text, single-column) and a <strong>human-friendly version</strong> (clean, modern design) with the same content.
                </p>
                <p>
                  We offer 7 professional templates including Basic ATS, Tech, Executive, Creative, Finance, Healthcare, and Academic styles.
                </p>
              </FAQItem>

              <FAQItem
                question="How is my data kept secure and private?"
                index={4}
              >
                <p className="mb-3">
                  Your privacy and security are our top priorities with <strong>enterprise-grade protection</strong>.
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-3">
                  <li><strong>SOC 2 Type II</strong> certified</li>
                  <li><strong>GDPR compliant</strong></li>
                  <li><strong>End-to-end encryption</strong></li>
                  <li><strong>Zero data selling</strong> - ever</li>
                  <li><strong>Auto-delete</strong> after 30 days</li>
                </ul>
                <p>
                  We don't even store your original contact information. Your resumes are processed in memory only and encrypted at rest.
                </p>
              </FAQItem>

              <FAQItem
                question="What if I'm not satisfied with the results?"
                index={5}
              >
                <p className="mb-3">
                  We offer an <strong>Interview Guarantee</strong> on our Pro plan - if you don't get 3+ interviews in 30 days, you get a <strong>full refund + 3 months free</strong>.
                </p>
                <p className="mb-3">
                  Our success rate is <strong>98%</strong>, and we're confident Resume Ninja will transform your job search.
                </p>
                <p>
                  Conditions: Apply to 50+ jobs with our optimized resumes, target roles matching your experience, and use job-tailored optimization.
                </p>
              </FAQItem>

              <FAQItem
                question="Can I use Resume Ninja for multiple job applications?"
                index={6}
              >
                <p className="mb-3">
                  Yes! Our Pro plan includes <strong>batch processing</strong> - upload 1 resume + 10 job descriptions and get 10 tailored versions instantly.
                </p>
                <p>
                  This saves you 2+ hours per application and ensures each resume is perfectly optimized for the specific role you're targeting.
                </p>
              </FAQItem>

              <FAQItem
                question="How do I get started?"
                index={7}
              >
                <p className="mb-3">
                  Getting started is easy and takes less than 2 minutes:
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Sign up for your free account (no credit card)</li>
                  <li>Upload your current resume</li>
                  <li>Get your first AI-optimized version instantly</li>
                  <li>Start applying with confidence!</li>
                </ol>
              </FAQItem>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:hello@resumeninja.com" 
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
              >
                Email Support
              </a>
              <a 
                href="/faq" 
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 font-medium hover:bg-accent transition-colors"
              >
                View Full FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
