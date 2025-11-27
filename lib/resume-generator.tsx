import type { OptimizedResume } from "@/lib/ai/schemas"

/**
 * Generate plain text resume content for download
 */
export function generatePlainTextResume(resume: Partial<OptimizedResume>): string {
  const lines: string[] = []

  // Contact
  if (resume.contact) {
    if (resume.contact.name) lines.push(resume.contact.name.toUpperCase())
    const contactDetails: string[] = []
    if (resume.contact.email) contactDetails.push(resume.contact.email)
    if (resume.contact.phone) contactDetails.push(resume.contact.phone)
    if (resume.contact.location) contactDetails.push(resume.contact.location)
    if (contactDetails.length > 0) lines.push(contactDetails.join(" | "))
    const links: string[] = []
    if (resume.contact.linkedin) links.push(`LinkedIn: ${resume.contact.linkedin}`)
    if (resume.contact.website) links.push(`Portfolio: ${resume.contact.website}`)
    if (links.length > 0) lines.push(links.join(" | "))
    lines.push("")
  }

  // Summary
  if (resume.summary) {
    lines.push("PROFESSIONAL SUMMARY")
    lines.push("-".repeat(50))
    lines.push(resume.summary)
    lines.push("")
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    lines.push("PROFESSIONAL EXPERIENCE")
    lines.push("-".repeat(50))
    for (const exp of resume.experience) {
      lines.push(`${exp.title} | ${exp.company}`)
      if (exp.startDate || exp.endDate) {
        lines.push(`${exp.startDate || ""} - ${exp.endDate || "Present"}`)
      }
      if (exp.bullets && exp.bullets.length > 0) {
        for (const bullet of exp.bullets) {
          lines.push(`• ${bullet}`)
        }
      }
      lines.push("")
    }
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    lines.push("EDUCATION")
    lines.push("-".repeat(50))
    for (const edu of resume.education) {
      lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`)
      lines.push(edu.institution)
      if (edu.graduationDate) lines.push(edu.graduationDate)
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`)
      lines.push("")
    }
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    lines.push("SKILLS")
    lines.push("-".repeat(50))
    lines.push(resume.skills.join(" • "))
    lines.push("")
  }

  return lines.join("\n")
}

/**
 * Generate HTML resume for PDF conversion
 */
export function generateHTMLResume(resume: Partial<OptimizedResume>): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 0.75in;
      max-width: 8.5in;
    }
    h1 { font-size: 18pt; margin-bottom: 4px; }
    h2 { 
      font-size: 12pt; 
      text-transform: uppercase; 
      border-bottom: 1px solid #1a1a1a; 
      padding-bottom: 4px;
      margin: 16px 0 8px 0;
    }
    .contact { font-size: 10pt; color: #444; margin-bottom: 8px; }
    .contact a { color: #0066cc; text-decoration: none; }
    .summary { margin-bottom: 12px; }
    .job { margin-bottom: 12px; }
    .job-header { display: flex; justify-content: space-between; align-items: baseline; }
    .job-title { font-weight: bold; }
    .job-company { color: #444; }
    .job-date { font-size: 10pt; color: #666; }
    .bullets { margin: 4px 0 0 16px; }
    .bullets li { margin-bottom: 2px; }
    .edu { margin-bottom: 8px; }
    .edu-degree { font-weight: bold; }
    .edu-school { color: #444; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { 
      background: #f0f0f0; 
      padding: 2px 8px; 
      border-radius: 4px; 
      font-size: 10pt;
    }
  </style>
</head>
<body>
  ${
    resume.contact
      ? `
    <h1>${resume.contact.name || "Your Name"}</h1>
    <p class="contact">
      ${[resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(" | ")}
      ${resume.contact.linkedin ? `<br><a href="${resume.contact.linkedin}">LinkedIn</a>` : ""}
      ${resume.contact.website ? ` | <a href="${resume.contact.website}">Portfolio</a>` : ""}
    </p>
  `
      : ""
  }

  ${
    resume.summary
      ? `
    <h2>Professional Summary</h2>
    <p class="summary">${resume.summary}</p>
  `
      : ""
  }

  ${
    resume.experience && resume.experience.length > 0
      ? `
    <h2>Professional Experience</h2>
    ${resume.experience
      .map(
        (exp) => `
      <div class="job">
        <div class="job-header">
          <span class="job-title">${exp.title}</span>
          <span class="job-date">${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
        </div>
        <div class="job-company">${exp.company}</div>
        ${
          exp.bullets && exp.bullets.length > 0
            ? `
          <ul class="bullets">
            ${exp.bullets.map((b) => `<li>${b}</li>`).join("")}
          </ul>
        `
            : ""
        }
      </div>
    `,
      )
      .join("")}
  `
      : ""
  }

  ${
    resume.education && resume.education.length > 0
      ? `
    <h2>Education</h2>
    ${resume.education
      .map(
        (edu) => `
      <div class="edu">
        <span class="edu-degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</span>
        <br>
        <span class="edu-school">${edu.institution}</span>
        ${edu.graduationDate ? ` | ${edu.graduationDate}` : ""}
        ${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
      </div>
    `,
      )
      .join("")}
  `
      : ""
  }

  ${
    resume.skills && resume.skills.length > 0
      ? `
    <h2>Skills</h2>
    <div class="skills">
      ${resume.skills.map((s) => `<span class="skill">${s}</span>`).join("")}
    </div>
  `
      : ""
  }
</body>
</html>`
}

/**
 * Download file utility
 */
export function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Print HTML as PDF (uses browser print)
 */
export function printAsPDF(html: string) {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}
