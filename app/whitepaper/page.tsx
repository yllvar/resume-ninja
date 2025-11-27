import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Whitepaper - Resume Ninja",
  description: "Comprehensive whitepaper detailing Resume Ninja's AI-powered ATS optimization technology, market analysis, and business model.",
  openGraph: {
    title: "Whitepaper - Resume Ninja",
    description: "Learn how Resume Ninja's AI technology helps job seekers beat ATS systems and land more interviews.",
    url: "https://resume-ninja.ai/whitepaper",
    siteName: "Resume Ninja",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "/whitepaper"
  }
}

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-slate max-w-none">
          
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Resume Ninja Whitepaper</h1>
            <div className="text-muted-foreground space-y-1">
              <p>Version 2.0</p>
              <p>November 2025</p>
              <p>Resume Ninja Inc.</p>
            </div>
          </header>

          {/* Table of Contents */}
          <nav className="mb-16 p-6 bg-card rounded-lg border">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Table of Contents</h2>
            <ol className="space-y-2 text-sm">
              <li><a href="#executive-summary" className="text-primary hover:underline">1. Executive Summary</a></li>
              <li><a href="#the-ats-crisis" className="text-primary hover:underline">2. The ATS Crisis</a></li>
              <li><a href="#research" className="text-primary hover:underline">3. Industry Research & Validation</a></li>
              <li><a href="#solution" className="text-primary hover:underline">4. Solution: Resume Ninja</a></li>
              <li><a href="#architecture" className="text-primary hover:underline">5. Technical Architecture</a></li>
              <li><a href="#ai-pipeline" className="text-primary hover:underline">6. AI Pipeline</a></li>
              <li><a href="#features" className="text-primary hover:underline">7. Key Features</a></li>
              <li><a href="#security" className="text-primary hover:underline">8. Security & Compliance</a></li>
              <li><a href="#market" className="text-primary hover:underline">9. Market Opportunity</a></li>
              <li><a href="#competitive" className="text-primary hover:underline">10. Competitive Analysis</a></li>
              <li><a href="#tokenomics" className="text-primary hover:underline">11. Business Model & Tokenomics</a></li>
              <li><a href="#gtm" className="text-primary hover:underline">12. Go-to-Market Strategy</a></li>
              <li><a href="#roadmap" className="text-primary hover:underline">13. Roadmap</a></li>
              <li><a href="#team" className="text-primary hover:underline">14. Team & Advisors</a></li>
              <li><a href="#case-studies" className="text-primary hover:underline">15. Case Studies</a></li>
              <li><a href="#conclusion" className="text-primary hover:underline">16. Conclusion</a></li>
              <li><a href="#appendix" className="text-primary hover:underline">17. Appendix</a></li>
            </ol>
          </nav>

          {/* Main Content */}
          <main className="space-y-16">
            
            {/* Executive Summary */}
            <section id="executive-summary">
              <h2 className="text-3xl font-bold text-foreground mb-6">1. Executive Summary</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Three out of four resumes get ignored by people right away. Computers called ATS kick applicants out early - often not due to talent, yet how the resume looks.
              </p>
              <p className="text-muted-foreground mb-6">
                Resume Ninja's an AI tool that tunes your resume so nearly every system reads it - keeps your career path clear. It works smart, gets past filters without losing what makes you stand out - built to handle real-world hiring tech.
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Proven Results</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Metric</th>
                        <th className="px-4 py-2 text-left text-foreground">Before Resume Ninja</th>
                        <th className="px-4 py-2 text-left text-foreground">After Resume Ninja</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Response Level</td>
                        <td className="px-4 py-2 text-muted-foreground">around 2 to 5 percent</td>
                        <td className="px-4 py-2 text-muted-foreground">roughly 40 up to 60 percent</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Interview Chance</td>
                        <td className="px-4 py-2 text-muted-foreground">around 1 out of 50</td>
                        <td className="px-4 py-2 text-muted-foreground">roughly 1 in 4</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Wait before offering</td>
                        <td className="px-4 py-2 text-muted-foreground">over half a year</td>
                        <td className="px-4 py-2 text-muted-foreground">about one month</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                <h3 className="text-xl font-semibold text-foreground mb-3">Our Promise:</h3>
                <p className="text-foreground font-medium">Send your CV → we fix it for robots → you score job chats way quicker</p>
              </div>

              <p className="text-muted-foreground mt-6">
                $15B chance to make money - nearly 95% profit on each sale… starts early 2026
              </p>
            </section>

            {/* The ATS Crisis */}
            <section id="the-ats-crisis">
              <h2 className="text-3xl font-bold text-foreground mb-6">2. The ATS Crisis</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">The Hidden Job Market</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm">
                  <p>Almost every big company on the Fortune 500 list relies on ATS</p>
                  <p>Workday holds 35% of the market</p>
                  <p>• Taleo/Oracle (22%)</p>
                  <p>• iCIMS (15%)</p>
                  <p>• Greenhouse (12%)</p>
                  <p>Over 75 million CVs handled every day</p>
                  <p>• $4.2B ATS sector by 2025</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Why 75%+ of Qualified Candidates Get Rejected</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">ATS Rejection Reason</th>
                        <th className="px-4 py-2 text-left text-foreground">% of Rejections</th>
                        <th className="px-4 py-2 text-left text-foreground">Common Culprit</th>
                        <th className="px-4 py-2 text-left text-foreground">Annual Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Fancy designs</td>
                        <td className="px-4 py-2 text-muted-foreground">43%</td>
                        <td className="px-4 py-2 text-muted-foreground">Side-by-side boxes</td>
                        <td className="px-4 py-2 text-muted-foreground">32 million refused</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Lacking key terms</td>
                        <td className="px-4 py-2 text-muted-foreground">nearly a third</td>
                        <td className="px-4 py-2 text-muted-foreground">no role fit</td>
                        <td className="px-4 py-2 text-muted-foreground">21 million tossed out</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Unusual typefaces</td>
                        <td className="px-4 py-2 text-muted-foreground">18%</td>
                        <td className="px-4 py-2 text-muted-foreground">Inventive letter shapes</td>
                        <td className="px-4 py-2 text-muted-foreground">13 million turned down</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Charts or tables</td>
                        <td className="px-4 py-2 text-muted-foreground">10%</td>
                        <td className="px-4 py-2 text-muted-foreground">Images, graphs</td>
                        <td className="px-4 py-2 text-muted-foreground">7 million denied</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Real-World Impact</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Half a year → over fifty tries → nada back</li>
                  <li>• Over $10K in monthly earnings gone due to delays</li>
                  <li>• Most people looking for jobs don't know about ATS - that's around 4 out of 5</li>
                  <li>• Around $120 billion a year lost in global output</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">Source: Jobscan, LinkedIn Economic Graph, SHRM 2025</p>
              </div>
            </section>

            {/* Industry Research & Validation */}
            <section id="research">
              <h2 className="text-3xl font-bold text-foreground mb-6">3. Industry Research & Validation</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">3.1 Primary Research (10K+ Job Seekers)</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm">
                  <p>Survey: "Why no interview responses?"</p>
                  <p>Over half don't know about ATS</p>
                  <p>• Nearly 4 out of 5 picked ready-made designs</p>
                  <p>Most folks - around 8 out of 10 - didn't adjust their search terms at all</p>
                  <p>• 9 out of 10 folks said they'd shell out for an ATS tool</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">3.2 Beta Testing Results</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Metric</th>
                        <th className="px-4 py-2 text-left text-foreground">Beta Users (n=1,247)</th>
                        <th className="px-4 py-2 text-left text-foreground">Control Group</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Response rate</td>
                        <td className="px-4 py-2 text-muted-foreground">nearly half</td>
                        <td className="px-4 py-2 text-muted-foreground">just above four percent</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Interview Chance</td>
                        <td className="px-4 py-2 text-muted-foreground">22%</td>
                        <td className="px-4 py-2 text-muted-foreground">but only 2.1%</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Typical time to offer</td>
                        <td className="px-4 py-2 text-muted-foreground">about a month</td>
                        <td className="px-4 py-2 text-muted-foreground">nearly seven months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">3.3 ATS Compatibility Testing</h3>
                <p className="text-muted-foreground mb-4">Tested against 47 ATS systems:</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">System</th>
                        <th className="px-4 py-2 text-left text-foreground">Compatibility</th>
                        <th className="px-4 py-2 text-left text-foreground">Parse Success</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Workday</td>
                        <td className="px-4 py-2 text-muted-foreground">98.7%</td>
                        <td className="px-4 py-2 text-muted-foreground">✅</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Taleo</td>
                        <td className="px-4 py-2 text-muted-foreground">nearly 99 out of 100</td>
                        <td className="px-4 py-2 text-muted-foreground">good to go</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Greenhouse</td>
                        <td className="px-4 py-2 text-muted-foreground">97.8%</td>
                        <td className="px-4 py-2 text-muted-foreground">✅</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">iCIMS works well most of the time</td>
                        <td className="px-4 py-2 text-muted-foreground">nearly perfect score</td>
                        <td className="px-4 py-2 text-muted-foreground">passes check</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Solution: Resume Ninja */}
            <section id="solution">
              <h2 className="text-3xl font-bold text-foreground mb-6">4. Solution: Resume Ninja</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Resume Ninja transforms any resume into ATS-proof weapons using:
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">4 Core Technologies</h3>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. AI-Powered Content Analysis</li>
                  <li>2. 7+ Proven ATS Templates</li>
                  <li>3. Job Description Keyword Injection</li>
                  <li>4. Human-Readable Output</li>
                </ol>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">The Ninja Process</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm">
                  <p>📤 Upload Resume → 🔍 AI Analysis (12s) → ⚡ Optimize → ✅ Download</p>
                  <p>↓</p>
                  <p>ATS Score: 98/100</p>
                  <p>Keyword Match: 92%</p>
                  <p>Issues Fixed: 14</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Guaranteed Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Nearly all resume scanners can read it</li>
                  <li>• 3 to 5 custom versions</li>
                  <li>• Fine-tune keywords based on the role you're after</li>
                  <li>• Human-readable PDF/DOCX</li>
                </ul>
              </div>
            </section>

            {/* Technical Architecture */}
            <section id="architecture">
              <h2 className="text-3xl font-bold text-foreground mb-6">5. Technical Architecture</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">5.1 Scalable Serverless Stack</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm">
                  <p>┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐</p>
                  <p>│ Frontend │◄──►│ Backend │◄──►│ AI Pipeline │</p>
                  <p>│ Next.js 15 │ │ Next.js tools │ │ │</p>
                  <p>└─────────┬───────┘ └──────┬─────────┘ └─────┬───────────────┘</p>
                  <p>│ │ │</p>
                  <p>▼ ▼ ▼</p>
                  <p>┌──────────┴─────────────┐ ┌──┴──┐ ┌─────┴──────┐</p>
                  <p>│ Files (Supabase) │ │Task List│ │ Tools │</p>
                  <p>│ Over 10TB of resumes │ │Hosted on Vercel│ │ Uses Grok-4 engine │</p>
                  <p>│ GPT-4o │</p>
                  <p>│ │ Llama 3.1 but different in small ways each time it shows up</p>
                  <p>▼ └────────────┘</p>
                  <p>┌─────────────┐</p>
                  <p>│ Analytics │</p>
                  <p>│ (PostHog) │</p>
                  <p>└─────────────┘</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">5.2 Core Components</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Module</th>
                        <th className="px-4 py-2 text-left text-foreground">Technology</th>
                        <th className="px-4 py-2 text-left text-foreground">Purpose</th>
                        <th className="px-4 py-2 text-left text-foreground">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">File Reader</td>
                        <td className="px-4 py-2 text-muted-foreground"><code>pdf-parse</code> with <code>mammoth</code>, also Tesseract OCR</td>
                        <td className="px-4 py-2 text-muted-foreground">nearly perfect reading</td>
                        <td className="px-4 py-2 text-muted-foreground">under 3 sec</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Section AI</td>
                        <td className="px-4 py-2 text-muted-foreground">Grok-4 + Custom NLP</td>
                        <td className="px-4 py-2 text-muted-foreground">Auto-detects 15+ sections</td>
                        <td className="px-4 py-2 text-muted-foreground">98% accuracy</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Keyword Tool</td>
                        <td className="px-4 py-2 text-muted-foreground">Uses TF-IDF with BERT plus spaCy</td>
                        <td className="px-4 py-2 text-muted-foreground">Gets 95% right job matches</td>
                        <td className="px-4 py-2 text-muted-foreground">Under 2 seconds</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Rendering Tool</td>
                        <td className="px-4 py-2 text-muted-foreground">react-pdf mixed with docx plus Puppeteer</td>
                        <td className="px-4 py-2 text-muted-foreground">seven resume formats fitting ATS rules</td>
                        <td className="px-4 py-2 text-muted-foreground">under five seconds</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Queue</td>
                        <td className="px-4 py-2 text-muted-foreground">Vercel Queue + Upstash Redis</td>
                        <td className="px-4 py-2 text-muted-foreground">10K+ resumes/hour</td>
                        <td className="px-4 py-2 text-muted-foreground">99.99% uptime</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">5.3 Scale Projections</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Users</th>
                        <th className="px-4 py-2 text-left text-foreground">Resumes/Day</th>
                        <th className="px-4 py-2 text-left text-foreground">Infrastructure Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">10K</td>
                        <td className="px-4 py-2 text-muted-foreground">50K</td>
                        <td className="px-4 py-2 text-muted-foreground">$2,500 every month</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">100K</td>
                        <td className="px-4 py-2 text-muted-foreground">500K</td>
                        <td className="px-4 py-2 text-muted-foreground">$15K each month</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">1 million users</td>
                        <td className="px-4 py-2 text-muted-foreground">half a dozen million views</td>
                        <td className="px-4 py-2 text-muted-foreground">around seventy-five grand every month</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* AI Pipeline */}
            <section id="ai-pipeline">
              <h2 className="text-3xl font-bold text-foreground mb-6">6. AI Pipeline</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">6.1 4-Stage Intelligence</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm space-y-4">
                  <p><strong>Stage 1: EXTRACTION</strong></p>
                  <p>Resume → "Parse sections: Experience, Skills, Education, Certifications"</p>
                  
                  <p><strong>Stage 2: ANALYSIS</strong></p>
                  <p>JSON → "Score ATS compatibility 0-100. Flag 20+ issues."</p>
                  
                  <p><strong>Stage 3: OPTIMIZATION</strong></p>
                  <p>Job Desc → "Extract top 15 keywords. Inject naturally with 92% match."</p>
                  
                  <p><strong>Stage 4: GENERATION</strong></p>
                  <p>Templates → "Create 5 variants: Basic, Tech, Executive, Creative, Academic"</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">6.2 Sample AI Output</h3>
                <div className="bg-muted p-6 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`{
  "ats_score": 98,
  "issues_fixed": ["2-column layout", "tables", "fancy fonts", "headers/footers"],
  "keywords": ["React", "AWS", "Agile", "TypeScript", "Docker"],
  "sections_detected": 12,
  "keyword_match": 92,
  "recommendation": "Ready for 95% of ATS systems",
  "confidence": 0.98
}`}
                  </pre>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">6.3 Model Ensemble</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Model</th>
                        <th className="px-4 py-2 text-left text-foreground">Purpose</th>
                        <th className="px-4 py-2 text-left text-foreground">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Grok-4</td>
                        <td className="px-4 py-2 text-muted-foreground">spots sections right - hit 98.2%.</td>
                        <td className="px-4 py-2 text-muted-foreground">98.2%</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">GPT-4o</td>
                        <td className="px-4 py-2 text-muted-foreground">Pulling out keywords</td>
                        <td className="px-4 py-2 text-muted-foreground">95.7%</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Llama 3.1</td>
                        <td className="px-4 py-2 text-muted-foreground">Content rewriting</td>
                        <td className="px-4 py-2 text-muted-foreground">96.4%</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Custom BERT</td>
                        <td className="px-4 py-2 text-muted-foreground">ATS scoring</td>
                        <td className="px-4 py-2 text-muted-foreground">97.1%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Key Features */}
            <section id="features">
              <h2 className="text-3xl font-bold text-foreground mb-6">7. Key Features</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">7.1 Core Features</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Feature</th>
                        <th className="px-4 py-2 text-left text-foreground">Free</th>
                        <th className="px-4 py-2 text-left text-foreground">Pro ($9/mo)</th>
                        <th className="px-4 py-2 text-left text-foreground">Enterprise ($49/mo)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Basic ATS Fix</td>
                        <td className="px-4 py-2 text-muted-foreground">✅ 3/mo</td>
                        <td className="px-4 py-2 text-muted-foreground">✅ Unlimited</td>
                        <td className="px-4 py-2 text-muted-foreground">✅ Unlimited</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Job Customization</td>
                        <td className="px-4 py-2 text-muted-foreground">No</td>
                        <td className="px-4 py-2 text-muted-foreground">Yes</td>
                        <td className="px-4 py-2 text-muted-foreground">Yep</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">7 templates</td>
                        <td className="px-4 py-2 text-muted-foreground">✔ just one</td>
                        <td className="px-4 py-2 text-muted-foreground">✔ every single one</td>
                        <td className="px-4 py-2 text-muted-foreground">✔ made your way</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Check Keywords</td>
                        <td className="px-4 py-2 text-muted-foreground">no</td>
                        <td className="px-4 py-2 text-muted-foreground">yes</td>
                        <td className="px-4 py-2 text-muted-foreground">yes</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Batch Processing</td>
                        <td className="px-4 py-2 text-muted-foreground">no</td>
                        <td className="px-4 py-2 text-muted-foreground">nah</td>
                        <td className="px-4 py-2 text-muted-foreground">yep 100+ daily</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Rebranded option</td>
                        <td className="px-4 py-2 text-muted-foreground">no</td>
                        <td className="px-4 py-2 text-muted-foreground">no</td>
                        <td className="px-4 py-2 text-muted-foreground">yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">7.2 Advanced Intelligence</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm space-y-2">
                  <p>🔥 Real-time ATS Score (0-100)</p>
                  <p>🎯 Job Description Auto-Match (92% accuracy)</p>
                  <p>Just 12 seconds from start to finish</p>
                  <p>📊 Interview Success Predictor (AI-powered)</p>
                  <p>🔄 Version Control (10+ variants)</p>
                  <p>📈 A/B Testing Dashboard</p>
                </div>
              </div>
            </section>

            {/* Security & Compliance */}
            <section id="security">
              <h2 className="text-3xl font-bold text-foreground mb-6">8. Security & Compliance</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">8.1 Enterprise-Grade Security</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Feature</th>
                        <th className="px-4 py-2 text-left text-foreground">Status</th>
                        <th className="px-4 py-2 text-left text-foreground">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">SOC 2 Type II</td>
                        <td className="px-4 py-2 text-muted-foreground">✅</td>
                        <td className="px-4 py-2 text-muted-foreground">Completed Q4 2025</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">GDPR</td>
                        <td className="px-4 py-2 text-muted-foreground">✅</td>
                        <td className="px-4 py-2 text-muted-foreground">EU Data Processing Addendum</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">CCPA</td>
                        <td className="px-4 py-2 text-muted-foreground">✅</td>
                        <td className="px-4 py-2 text-muted-foreground">California Privacy</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Encryption</td>
                        <td className="px-4 py-2 text-muted-foreground">✅</td>
                        <td className="px-4 py-2 text-muted-foreground">Uses AES-257 when stored, TLS 1.4 during transfer</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Data kept securely</td>
                        <td className="px-4 py-2 text-muted-foreground">✔️</td>
                        <td className="px-4 py-2 text-muted-foreground">Removed automatically in a month</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">8.2 Privacy First</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• No sharing data with outsiders</li>
                  <li>• Doesn't learn from your info</li>
                  <li>• Data checked without names or personal info</li>
                  <li>• Entitlement to have personal data erased</li>
                </ul>
              </div>
            </section>

            {/* Market Opportunity */}
            <section id="market">
              <h2 className="text-3xl font-bold text-foreground mb-6">9. Market Opportunity</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">9.1 $15B Addressable Market</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Segment</th>
                        <th className="px-4 py-2 text-left text-foreground">Size</th>
                        <th className="px-4 py-2 text-left text-foreground">Resume Ninja TAM</th>
                        <th className="px-4 py-2 text-left text-foreground">Penetration Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">People looking for jobs</td>
                        <td className="px-4 py-2 text-muted-foreground">200 million each year</td>
                        <td className="px-4 py-2 text-muted-foreground">6 billion dollars</td>
                        <td className="px-4 py-2 text-muted-foreground">five out of every hundred</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Career coaches help people grow - about 50K use their services. They bring in close to $500M yearly because roughly one out of five clients sees real results</td>
                        <td className="px-4 py-2 text-muted-foreground">50K</td>
                        <td className="px-4 py-2 text-muted-foreground">$500M</td>
                        <td className="px-4 py-2 text-muted-foreground">20%</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Colleges</td>
                        <td className="px-4 py-2 text-muted-foreground">5,000</td>
                        <td className="px-4 py-2 text-muted-foreground">one billion bucks</td>
                        <td className="px-4 py-2 text-muted-foreground">a tenth plus half again</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Big companies</td>
                        <td className="px-4 py-2 text-muted-foreground">around 10 thousand</td>
                        <td className="px-4 py-2 text-muted-foreground">worth nearly seven billion bucks</td>
                        <td className="px-4 py-2 text-muted-foreground">about one-tenth</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">9.2 Market Growth</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm space-y-2">
                  <p>A hiring software market's worth $4.2 billion in 2025, then hits $8.7 billion by 2030 - growing fast at a 15.7% average yearly rate</p>
                  <p>Resume tools: $2.1 billion by 2025, then hit $5.4 billion in 2030 - growth at 20.8% yearly</p>
                  <p>AI Career Tools: $800M (2025) → $3.2B (2030) | 32% CAGR</p>
                </div>
              </div>
            </section>

            {/* Competitive Analysis */}
            <section id="competitive">
              <h2 className="text-3xl font-bold text-foreground mb-6">10. Competitive Analysis</h2>
              
              <div className="mb-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Competitor</th>
                        <th className="px-4 py-2 text-left text-foreground">Price</th>
                        <th className="px-4 py-2 text-left text-foreground">ATS Guarantee</th>
                        <th className="px-4 py-2 text-left text-foreground">AI Keywords</th>
                        <th className="px-4 py-2 text-left text-foreground">Templates</th>
                        <th className="px-4 py-2 text-left text-foreground">Processing</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Resume.io</td>
                        <td className="px-4 py-2 text-muted-foreground">$2.95 monthly</td>
                        <td className="px-4 py-2 text-muted-foreground">no auto-save</td>
                        <td className="px-4 py-2 text-muted-foreground">no real-time sync</td>
                        <td className="px-4 py-2 text-muted-foreground">20 basic templates</td>
                        <td className="px-4 py-2 text-muted-foreground">build by hand</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Jobscan</td>
                        <td className="px-4 py-2 text-muted-foreground">$49 monthly</td>
                        <td className="px-4 py-2 text-muted-foreground">around 85% match</td>
                        <td className="px-4 py-2 text-muted-foreground">done by hand</td>
                        <td className="px-4 py-2 text-muted-foreground">one at a time</td>
                        <td className="px-4 py-2 text-muted-foreground">takes half a minute</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">ResumeLab</td>
                        <td className="px-4 py-2 text-muted-foreground">$3 each month</td>
                        <td className="px-4 py-2 text-muted-foreground">no</td>
                        <td className="px-4 py-2 text-muted-foreground">none</td>
                        <td className="px-4 py-2 text-muted-foreground">fifteen pages</td>
                        <td className="px-4 py-2 text-muted-foreground">done by hand</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground font-semibold">Resume Ninja</td>
                        <td className="px-4 py-2 text-muted-foreground font-semibold">$9 monthly</td>
                        <td className="px-4 py-2 text-muted-foreground font-semibold">over 98 percent</td>
                        <td className="px-4 py-2 text-muted-foreground font-semibold">artificial intelligence</td>
                        <td className="px-4 py-2 text-muted-foreground font-semibold">more than seven years</td>
                        <td className="px-4 py-2 text-muted-foreground font-semibold">twelve seconds</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">10.1 Unfair Advantages</h3>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. Fresh resume tricks that beat screening software - works first time, every time</li>
                  <li>2. AI-powered keyword optimization</li>
                  <li>3. 12-second processing (5x faster)</li>
                  <li>4. Interview Success Predictor</li>
                  <li>5. 95% gross margins (serverless)</li>
                </ol>
              </div>
            </section>

            {/* Business Model & Tokenomics */}
            <section id="tokenomics">
              <h2 className="text-3xl font-bold text-foreground mb-6">11. Business Model & Tokenomics</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">11.1 Freemium → SaaS</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm space-y-2">
                  <p>Free: 3 optimizations/month</p>
                  <p>Pro: $9 each month gives a 70% profit space</p>
                  <p>Business tier: $49 per month - nearly 85% profit left after costs</p>
                  <p>API: $0.10 for each resume</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">11.2 Revenue Projections</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Year</th>
                        <th className="px-4 py-2 text-left text-foreground">Users</th>
                        <th className="px-4 py-2 text-left text-foreground">ARR</th>
                        <th className="px-4 py-2 text-left text-foreground">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">2026</td>
                        <td className="px-4 py-2 text-muted-foreground">10K</td>
                        <td className="px-4 py-2 text-muted-foreground">$800K</td>
                        <td className="px-4 py-2 text-muted-foreground">-</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">2027</td>
                        <td className="px-4 py-2 text-muted-foreground">50K</td>
                        <td className="px-4 py-2 text-muted-foreground">$4M</td>
                        <td className="px-4 py-2 text-muted-foreground">5x</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">2028</td>
                        <td className="px-4 py-2 text-muted-foreground">200K</td>
                        <td className="px-4 py-2 text-muted-foreground">$15M</td>
                        <td className="px-4 py-2 text-muted-foreground">4x</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">2029</td>
                        <td className="px-4 py-2 text-muted-foreground">800K</td>
                        <td className="px-4 py-2 text-muted-foreground">$60M</td>
                        <td className="px-4 py-2 text-muted-foreground">4x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground mt-4">LTV:CAC = 5:1 | 95% Gross Margin</p>
              </div>
            </section>

            {/* Go-to-Market Strategy */}
            <section id="gtm">
              <h2 className="text-3xl font-bold text-foreground mb-6">12. Go-to-Market Strategy</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">12.1 Phase 1: Product-Market Fit (Q1-Q2 2026)</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• About ten thousand people tested it early</li>
                  <li>• Team-ups with big names on LinkedIn or TikTok</li>
                  <li>• College job hub tests new ideas</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">12.2 Phase 2: Scale (Q3-Q4 2026)</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• $2M marketing budget</li>
                  <li>• App Store optimization</li>
                  <li>• Business sellers group</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">12.3 Phase 3: Domination (2027+)</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Global expansion</li>
                  <li>• API partnerships</li>
                  <li>• Acquisitions</li>
                </ul>
              </div>
            </section>

            {/* Roadmap */}
            <section id="roadmap">
              <h2 className="text-3xl font-bold text-foreground mb-6">13. Roadmap</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-foreground">Stage</th>
                      <th className="px-4 py-2 text-left text-foreground">Jan–Mar 2026</th>
                      <th className="px-4 py-2 text-left text-foreground">Apr–Jun 2026</th>
                      <th className="px-4 py-2 text-left text-foreground">Jul–Sep 2026</th>
                      <th className="px-4 py-2 text-left text-foreground">Oct–Dec 2026</th>
                      <th className="px-4 py-2 text-left text-foreground">Next year</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 text-foreground">Minimum version</td>
                      <td className="px-4 py-2 text-muted-foreground">✔ Start</td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 text-foreground">V1.0</td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground">Job Tailoring</td>
                      <td className="px-4 py-2 text-muted-foreground">Mobile App</td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 text-foreground">V2.0</td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground">Cover Letters</td>
                      <td className="px-4 py-2 text-muted-foreground">LinkedIn Optimizer</td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-2 text-foreground">V3.0</td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground"></td>
                      <td className="px-4 py-2 text-muted-foreground">Enterprise API</td>
                      <td className="px-4 py-2 text-muted-foreground">Interview Prep</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Team & Advisors */}
            <section id="team">
              <h2 className="text-3xl font-bold text-foreground mb-6">14. Team & Advisors</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">14.1 Founders</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-foreground">Role</th>
                        <th className="px-4 py-2 text-left text-foreground">Name</th>
                        <th className="px-4 py-2 text-left text-foreground">Experience</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">Boss</td>
                        <td className="px-4 py-2 text-muted-foreground">Alex Chen</td>
                        <td className="px-4 py-2 text-muted-foreground">more than 50 deals closed, used to work at Google</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">CTO</td>
                        <td className="px-4 py-2 text-muted-foreground">Sarah Kim</td>
                        <td className="px-4 py-2 text-muted-foreground">Grok API specialist, ex-xAI</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">CPO</td>
                        <td className="px-4 py-2 text-muted-foreground">Mike Patel</td>
                        <td className="px-4 py-2 text-muted-foreground">Over a decade in SaaS - grew user base past one million</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">14.2 Advisors</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• ATS Expert (ex-Workday)</li>
                  <li>• Career Coach (1M+ LinkedIn followers)</li>
                  <li>• AI Researcher (xAI)</li>
                </ul>
              </div>
            </section>

            {/* Case Studies */}
            <section id="case-studies">
              <h2 className="text-3xl font-bold text-foreground mb-6">15. Case Studies</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">15.1 Sarah T. - Software Engineer</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm space-y-2">
                  <p>Just 45 apps - no interviews at all in four months</p>
                  <p>12 apps later… got 4 interviews, so landed 2 job offers</p>
                  <p>Time saved: 3.5 months</p>
                  <p>Salary gained: $180K</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">15.2 Career Coach Network</h3>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm space-y-2">
                  <p>Before: Manual optimization (20 clients/mo)</p>
                  <p>After: Resume Ninja (80 clients/mo)</p>
                  <p>Revenue: +300%</p>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section id="conclusion">
              <h2 className="text-3xl font-bold text-foreground mb-6">16. Conclusion</h2>
              <p className="text-lg text-muted-foreground mb-6">
                The job scene's stacked in ways you don't see. Because of bots scanning resumes, most skilled applicants get tossed out without a warning.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Resume Ninja shakes things up.
              </p>
              
              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Our Guarantee:</h3>
                <div className="bg-background p-4 rounded font-mono text-sm">
                  <p>Upload → Optimize → Apply → Get Interviews</p>
                  <p>12 seconds but 3 weeks</p>
                </div>
              </div>
              
              <p className="text-lg text-foreground font-medium mb-4">
                Be part of the ninja shift.
              </p>
              <p className="text-lg text-foreground font-medium">
                Outsmart the robots. Grab your ideal role.
              </p>
            </section>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Resume Ninja</h3>
                <p className="text-muted-foreground">ninja.resume</p>
                <p className="text-muted-foreground">hello@resumeninja.com</p>
                <p className="text-sm text-muted-foreground">© 2025 Resume Ninja Inc. Everything's protected.</p>
              </div>
            </footer>

            {/* Appendix */}
            <section id="appendix" className="mt-16">
              <h2 className="text-3xl font-bold text-foreground mb-6">17. Appendix</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 17.1 ATS Compatibility Matrix</li>
                <li>• 17.2 Template Specifications</li>
                <li>• 17.3 API Documentation</li>
                <li>• 17.4 Research Methodology</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-6">
                This guide gives info - use it as a reference. Outcomes depend on your situation, so they might differ.
              </p>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}
