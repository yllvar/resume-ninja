"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
  index: number;
  defaultOpen?: boolean;
}

const FAQItem = ({ question, children, index, defaultOpen = false }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border/40 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-3 font-medium hover:text-primary transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${index}`}
        id={`faq-question-${index}`}
      >
        <span>{question}</span>
        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
      <div 
        id={`faq-content-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pb-2">
          {children}
        </div>
      </div>
    </div>
  );
};

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border">
      <thead>
        <tr className="bg-muted">
          {headers.map((header, i) => (
            <th key={i} className="border p-2 text-left whitespace-nowrap">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="border p-2 whitespace-nowrap">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function FAQPage() {
  return (
    <div className="container max-w-5xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Resume Ninja FAQ</h1>
        <p className="text-muted-foreground">Updated: November 2025</p>
        <p className="text-lg mt-2">Beat the ATS. Land Your Dream Job.</p>
      </div>

      <div className="space-y-12">
        {/* Getting Started Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              🚀 Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <FAQItem 
              question="1. What is Resume Ninja?"
              index={0}
              defaultOpen
            >
              <p className="text-muted-foreground">
                Resume Ninja is the <strong>world's first AI-powered resume optimization platform</strong> that guarantees{" "}
                <strong>98%+ ATS compatibility</strong>.
              </p>
              <p className="mt-4 font-medium">We solve the #1 job search problem:</p>
              <p className="text-muted-foreground">
                <strong>75% of resumes get auto-rejected by Applicant Tracking Systems (ATS)</strong> before humans see
                them.
              </p>
              <p className="mt-4 font-medium">Our magic:</p>
              <p className="text-muted-foreground">
                Upload any resume → AI analyzes → Download <strong>ATS-proof versions</strong> →{" "}
                <strong>10x more interviews</strong>.
              </p>
            </FAQItem>

            <FAQItem
              question="2. How does Resume Ninja actually work?"
              index={1}
              defaultOpen
            >
              <p className="font-medium mb-2">4-step ninja process (12 seconds total):</p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="mb-2">📤 1. UPLOAD any resume (PDF/DOCX)</p>
                <p className="mb-2">
                  🔍 2. AI ANALYSIS
                  <br />
                  <span className="ml-4">• Detects 15+ sections automatically</span>
                  <br />
                  <span className="ml-4">• Scores ATS compatibility (0-100%)</span>
                  <br />
                  <span className="ml-4">• Flags formatting issues</span>
                </p>
                <p className="mb-2">
                  ⚡ 3. OPTIMIZATION
                  <br />
                  <span className="ml-4">• Converts to 7+ ATS templates</span>
                  <br />
                  <span className="ml-4">• Injects job-specific keywords</span>
                  <br />
                  <span className="ml-4">• Removes ATS killers (tables, graphics, fancy fonts)</span>
                </p>
                <p className="mb-2">
                  ✅ 4. DOWNLOAD
                  <br />
                  <span className="ml-4">• PDF + DOCX versions</span>
                  <br />
                  <span className="ml-4">• Side-by-side comparison</span>
                </p>
              </div>
              <p className="text-muted-foreground">
                <strong>Real results:</strong> <strong>2-5% → 40-60% response rate</strong>
              </p>
            </FAQItem>

            <FAQItem
              question="3. What makes Resume Ninja different from Resume.io or Jobscan?"
              index={2}
            >
              <p className="font-medium mb-4">Here's how we compare to the competition:</p>
              <Table
                headers={["Feature", "Resume Ninja", "Resume.io", "Jobscan"]}
                rows={[
                  ["ATS Guarantee", "98%+", "❌", "80-90%"],
                  ["AI Templates", "7+ proven", "20 generic", "1 basic"],
                  ["Keyword Optimization", "AI-powered", "❌", "Manual"],
                  ["Processing Time", "12 seconds", "2-3 min", "30 sec"],
                  ["Price", "$9/mo", "$2.95/mo", "$49/mo"],
                  ["Interview Predictor", "✅", "❌", "❌"]
                ]}
              />
              <p className="mt-4 font-medium">Our edge: <strong>Guaranteed ATS pass + AI intelligence</strong></p>
            </FAQItem>
          </CardContent>
        </Card>

        {/* Technical & ATS Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              ⚙️ Technical & ATS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <FAQItem
              question="4. Which ATS systems does Resume Ninja support?"
              index={3}
            >
              <p className="text-muted-foreground mb-4">
                <strong>99% of the market:</strong>
              </p>
              <Table
                headers={["ATS System", "Market Share", "Resume Ninja Compatible"]}
                rows={[
                  ["Workday", "35%", "✅"],
                  ["Taleo/Oracle", "22%", "✅"],
                  ["iCIMS", "15%", "✅"],
                  ["Greenhouse", "12%", "✅"],
                  ["Others", "16%", "✅"]
                ]}
              />
              <p className="mt-4 text-muted-foreground">
                <strong>We test against real ATS systems weekly.</strong>
              </p>
            </FAQItem>

            <FAQItem
              question="5. Will my optimized resume still look professional to humans?"
              index={4}
            >
              <p className="text-2xl font-bold mb-4">Yes! 100%</p>
              <p className="font-medium mb-2">We create dual-optimized resumes:</p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-1">
                  <strong>ATS Version</strong>: Plain text, single-column, standard fonts
                </li>
                <li>
                  <strong>Human Version</strong>: Clean, modern design (same content)
                </li>
              </ul>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="mb-2">Before: 🎨 Creative (ATS: 23/100) → Rejected</p>
                <p>After: 📄 ATS + 👔 Professional (ATS: 98/100) → Interviews</p>
              </div>
              <p className="font-medium mb-2">7 templates available:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li><strong>Basic ATS</strong> (universal)</li>
                <li><strong>Tech</strong> (developers)</li>
                <li><strong>Executive</strong> (managers)</li>
                <li><strong>Creative</strong> (designers/marketing)</li>
                <li><strong>Finance</strong></li>
                <li><strong>Healthcare</strong></li>
                <li><strong>Academic</strong></li>
              </ol>
            </FAQItem>

            <FAQItem
              question="6. How does the keyword optimization work?"
              index={5}
            >
              <p className="font-medium mb-2">AI-powered job matching:</p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p>1. Upload Job Description</p>
                <p>2. AI extracts TOP 15 keywords</p>
                <p>3. Smart insertion (natural, not spammy)</p>
                <p>4. Keyword match score: 85-95%</p>
              </div>
              <p className="font-medium mb-2">Example:</p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p>Job: "Senior React Developer"</p>
                <p>Keywords extracted: React, TypeScript, AWS, Agile, CI/CD</p>
                <p>→ Added to Skills + Experience sections naturally</p>
              </div>
              <p className="font-medium">Pro Tip: Higher keyword match = <strong>Higher ATS ranking</strong></p>
            </FAQItem>
          </CardContent>
        </Card>

        {/* Pricing & Plans Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              💰 Pricing & Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <FAQItem
              question="7. What are your pricing plans?"
              index={6}
            >
              <Table
                headers={["Plan", "Price", "Optimizations", "Best For"]}
                rows={[
                  ["Free", "$0", "3/month", "Testing"],
                  ["Pro", "$9/mo", "Unlimited", "Job seekers"],
                  ["Enterprise", "$49/mo", "Unlimited + Team", "Coaches/Agencies"]
                ]}
              />
              <p className="mt-4 text-muted-foreground">
                <strong>30-day money-back guarantee</strong><br />
                <strong>Cancel anytime</strong>
              </p>
              <p className="mt-2 text-muted-foreground">
                <strong>Most popular: Pro plan (87% of users)</strong>
              </p>
            </FAQItem>

            <FAQItem
              question="8. Do you offer refunds or guarantees?"
              index={7}
            >
              <p className="text-2xl font-bold mb-4">✅ Interview Guarantee (Pro plan only)</p>
              <p className="font-medium">If you don't get 3+ interviews in 30 days:</p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-1"><strong>Full refund</strong></li>
                <li><strong>+ 3 months free</strong></li>
              </ul>
              <p className="font-medium">Conditions:</p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-1">Apply to 50+ jobs with Resume Ninja resumes</li>
                <li className="mb-1">Target roles matching your experience</li>
                <li>Use job-tailored optimization</li>
              </ul>
              <p className="font-bold">98% success rate → Risk-free</p>
            </FAQItem>
          </CardContent>
        </Card>

        {/* Results & Analytics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              📊 Results & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <FAQItem
              question="9. How do I know it's working?"
              index={8}
            >
              <p className="font-medium mb-2">Real-time success metrics:</p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p>📈 ATS Score: 98/100 ✅</p>
                <p>🎯 Keyword Match: 92% ✅</p>
                <p>🚀 Response Rate Predictor: 47% (vs 4% average)</p>
                <p>📋 Application Tracker (Pro+)</p>
              </div>
              <p className="font-medium mb-2">Pro users get:</p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-1"><strong>Interview Success Predictor</strong> (AI-based)</li>
                <li className="mb-1"><strong>Application Analytics</strong></li>
                <li><strong>A/B Testing</strong> (different templates)</li>
              </ul>
              <p className="font-medium mb-2">Average results:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p>Week 1: 2-3 callbacks</p>
                <p>Week 2: 3-5 interviews</p>
                <p>Week 3: 1+ offers</p>
              </div>
            </FAQItem>

            <FAQItem
              question="10. Is my data secure and private?"
              index={9}
            >
              <p className="text-2xl font-bold mb-4">✅ Enterprise-grade security</p>
              <Table
                headers={["Security Feature", "Status"]}
                rows={[
                  ["SOC 2 Type II", "✅"],
                  ["GDPR Compliant", "✅"],
                  ["End-to-end Encryption", "✅"],
                  ["Zero data selling", "✅"],
                  ["Auto-delete after 30 days", "✅"]
                ]}
              />
              <p className="font-medium mt-4">Your resumes are:</p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-1"><strong>Never shared</strong> with 3rd parties</li>
                <li className="mb-1"><strong>Auto-deleted</strong> after 30 days</li>
                <li className="mb-1"><strong>Encrypted at rest</strong> (Supabase)</li>
                <li><strong>Processed in memory only</strong></li>
              </ul>
              <p className="font-medium">Privacy first: We don't even store your original contact info.</p>
            </FAQItem>
          </CardContent>
        </Card>

        {/* Advanced Usage Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              🎯 Advanced Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <FAQItem
              question="11. Can I optimize for multiple job applications?"
              index={10}
            >
              <p className="text-2xl font-bold mb-4">✅ Batch processing (Pro+)</p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p>Upload 1 resume + 10 job descriptions</p>
                <p>→ Get 10 tailored versions</p>
                <p>→ Save 2+ hours per application</p>
              </div>
              <p className="font-bold">Enterprise: 100+ applications/day</p>
            </FAQItem>

            <FAQItem
              question="12. Does Resume Ninja work for cover letters too?"
              index={11}
            >
              <p className="text-2xl font-bold mb-4">✅ Coming Q2 2026 (per roadmap)</p>
              <p className="font-medium mb-2">Future features:</p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-1"><strong>AI Cover Letter Generator</strong></li>
                <li className="mb-1"><strong>LinkedIn Profile Optimizer</strong></li>
                <li><strong>Interview Prep Assistant</strong></li>
              </ul>
              <p className="text-muted-foreground">
                <strong>Current workaround:</strong> Use our <strong>keyword extraction</strong> on job descriptions manually.
              </p>
            </FAQItem>

            <FAQItem
              question="13. What file formats do you support?"
              index={12}
            >
              <p className="text-2xl font-bold mb-4">✅ Input: PDF, DOCX, DOC<br />✅ Output: PDF + DOCX</p>
              <p className="font-medium mb-2">99% parse accuracy with:</p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-1"><strong>AI-powered OCR</strong> for scanned PDFs</li>
                <li className="mb-1"><strong>Complex layout detection</strong></li>
                <li><strong>Section auto-detection</strong></li>
              </ul>
            </FAQItem>

            <FAQItem
              question="14. Can I use Resume Ninja for my clients? (Coaches/Agencies)"
              index={13}
            >
              <p className="text-2xl font-bold mb-4">✅ Enterprise plan built for you</p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p>✅ White-label branding</p>
                <p>✅ Team accounts (unlimited users)</p>
                <p>✅ Batch processing (100+/day)</p>
                <p>✅ API access</p>
                <p>✅ Custom templates</p>
              </div>
              <p className="font-medium">Case study: Career coach went from <strong>5 clients/mo → 45 clients/mo</strong></p>
            </FAQItem>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center py-8">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/pricing">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="mailto:hello@resumeninja.com">Questions? Email Us</Link>
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Beat the bots. Become unstoppable. 🥷
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}