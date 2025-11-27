import type { OptimizedResume } from "@/lib/ai/schemas"

export function generateClassicHTML(resume: Partial<OptimizedResume>): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Times New Roman', Times, serif; 
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      padding: 0.5in 0.75in;
      max-width: 8.5in;
    }
    h1 { font-size: 16pt; text-align: center; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
    h2 { font-size: 11pt; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 12px 0 6px 0; letter-spacing: 0.5px; }
    .contact { text-align: center; font-size: 10pt; margin-bottom: 8px; }
    .contact a { color: #000; }
    .summary { text-align: justify; margin-bottom: 8px; }
    .job { margin-bottom: 10px; }
    .job-line { display: flex; justify-content: space-between; }
    .job-title { font-weight: bold; }
    .bullets { margin: 4px 0 0 18px; }
    .bullets li { margin-bottom: 2px; text-align: justify; }
    .edu { margin-bottom: 6px; }
    .skills-list { text-align: justify; }
  </style>
</head>
<body>
  ${
    resume.contact
      ? `
    <h1>${resume.contact.name || "YOUR NAME"}</h1>
    <p class="contact">
      ${[resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(" • ")}
      ${resume.contact.linkedin ? `<br>${resume.contact.linkedin}` : ""}
      ${resume.contact.website ? ` | ${resume.contact.website}` : ""}
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
    resume.experience?.length
      ? `
    <h2>Professional Experience</h2>
    ${resume.experience
      .map(
        (exp) => `
      <div class="job">
        <div class="job-line">
          <span class="job-title">${exp.title}, ${exp.company}</span>
          <span>${exp.startDate || ""} – ${exp.endDate || "Present"}</span>
        </div>
        ${
          exp.bullets?.length
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
    resume.education?.length
      ? `
    <h2>Education</h2>
    ${resume.education
      .map(
        (edu) => `
      <div class="edu">
        <div class="job-line">
          <span><strong>${edu.degree}${edu.field ? `, ${edu.field}` : ""}</strong>, ${edu.institution}</span>
          <span>${edu.graduationDate || ""}</span>
        </div>
        ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ""}
      </div>
    `,
      )
      .join("")}
  `
      : ""
  }

  ${
    resume.skills?.length
      ? `
    <h2>Skills</h2>
    <p class="skills-list">${resume.skills.join(" • ")}</p>
  `
      : ""
  }
</body>
</html>`
}

export function generateClassicText(resume: Partial<OptimizedResume>): string {
  const lines: string[] = []
  const divider = "═".repeat(60)

  if (resume.contact) {
    lines.push(resume.contact.name?.toUpperCase() || "YOUR NAME")
    lines.push([resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(" | "))
    if (resume.contact.linkedin || resume.contact.website) {
      lines.push([resume.contact.linkedin, resume.contact.website].filter(Boolean).join(" | "))
    }
    lines.push("")
  }

  if (resume.summary) {
    lines.push("PROFESSIONAL SUMMARY")
    lines.push(divider)
    lines.push(resume.summary)
    lines.push("")
  }

  if (resume.experience?.length) {
    lines.push("PROFESSIONAL EXPERIENCE")
    lines.push(divider)
    for (const exp of resume.experience) {
      lines.push(`${exp.title} | ${exp.company}`)
      lines.push(`${exp.startDate || ""} - ${exp.endDate || "Present"}`)
      if (exp.bullets?.length) {
        for (const bullet of exp.bullets) {
          lines.push(`  • ${bullet}`)
        }
      }
      lines.push("")
    }
  }

  if (resume.education?.length) {
    lines.push("EDUCATION")
    lines.push(divider)
    for (const edu of resume.education) {
      lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ""} | ${edu.institution}`)
      if (edu.graduationDate) lines.push(edu.graduationDate)
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`)
      lines.push("")
    }
  }

  if (resume.skills?.length) {
    lines.push("SKILLS")
    lines.push(divider)
    lines.push(resume.skills.join(" • "))
  }

  return lines.join("\n")
}
