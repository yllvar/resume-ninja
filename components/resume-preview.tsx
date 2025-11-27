"use client"

import type { ResumeAnalysis } from "@/lib/ai/schemas"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Globe, Linkedin, User, Briefcase, GraduationCap, Wrench } from "lucide-react"

interface ResumePreviewProps {
  analysis: Partial<ResumeAnalysis>
}

export function ResumePreview({ analysis }: ResumePreviewProps) {
  const { contact, summary, experience, education, skills } = analysis

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header / Contact */}
      <div className="border-b border-border bg-secondary/30 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{contact?.name || "Your Name"}</h2>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {contact?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {contact.email}
                </span>
              )}
              {contact?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {contact.phone}
                </span>
              )}
              {contact?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {contact.location}
                </span>
              )}
              {contact?.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </span>
              )}
              {contact?.website && (
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Portfolio
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Summary */}
        {summary && (
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
              <User className="h-5 w-5 text-primary" />
              Professional Summary
            </h3>
            <p className="text-muted-foreground leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              Experience
            </h3>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold text-foreground">{exp.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-primary">{exp.company}</p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <GraduationCap className="h-5 w-5 text-primary" />
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                    <span className="text-sm text-muted-foreground">{edu.graduationDate}</span>
                  </div>
                  <p className="text-primary">{edu.institution}</p>
                  {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Wrench className="h-5 w-5 text-primary" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-secondary text-secondary-foreground">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
