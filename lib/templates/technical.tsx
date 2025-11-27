import type { OptimizedResume } from "@/lib/ai/schemas"

export function generateTechnicalHTML(resume: Partial<OptimizedResume>): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Consolas', 'Monaco', monospace; 
      font-size: 10pt;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 0.5in 0.6in;
      max-width: 8.5in;
    }
    h1 { font-size: 18pt; font-weight: normal; margin-bottom: 4px; }
    h2 { 
      font-size: 10pt; 
      background: #1a1a1a;
      color: #fff;
      padding: 4px 8px;
      margin: 14px 0 8px 0;
      display: inline-block;
    }
    .section { margin-bottom: 12px; }
    .contact { font-size: 9pt; color: #666; font-family: Arial, sans-serif; }
    .contact a { color: #0066cc; }
    .summary { background: #f5f5f5; padding: 10px; border-left: 3px solid #333; margin-bottom: 8px; font-family: Arial, sans-serif; }
    .job { margin-bottom: 12px; padding-left: 8px; border-left: 2px solid #ddd; }
    .job-header { font-family: Arial, sans-serif; }
    .job-title { font-weight: bold; }
    .job-meta { font-size: 9pt; color: #666; }
    .bullets { margin: 6px 0 0 16px; font-family: Arial, sans-serif; font-size: 10pt; }
    .bullets li { margin-bottom: 3px; }
    .edu { margin-bottom: 8px; font-family: Arial, sans-serif; }
    .skills-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .skill { 
      background: #e8e8e8; 
      padding: 3px 8px; 
      font-size: 9pt;
      text-align: center;
    }
    .tech-tag { background: #1a1a1a; color: #fff; }
  </style>
</head>
<body>
  ${
    resume.contact
      ? `
    <h1>${resume.contact.name || "Your Name"}</h1>
    <p class="contact">
      ${resume.contact.email || ""} 
      ${resume.contact.phone ? `| ${resume.contact.phone}` : ""} 
      ${resume.contact.location ? `| ${resume.contact.location}` : ""}
      ${resume.contact.linkedin ? `| <a href="${resume.contact.linkedin}">LinkedIn</a>` : ""}
      ${resume.contact.website ? `| <a href="${resume.contact.website}">GitHub/Portfolio</a>` : ""}
    </p>
  `
      : ""
  }

  ${
    resume.skills?.length
      ? `
    <div class="section">
      <h2>// TECH STACK</h2>
      <div class="skills-grid">
        ${resume.skills.map((s) => `<span class="skill">${s}</span>`).join("")}
      </div>
    </div>
  `
      : ""
  }

  ${
    resume.summary
      ? `
    <div class="section">
      <h2>// SUMMARY</h2>
      <p class="summary">${resume.summary}</p>
    </div>
  `
      : ""
  }

  ${
    resume.experience?.length
      ? `
    <div class="section">
      <h2>// EXPERIENCE</h2>
      ${resume.experience
        .map(
          (exp) => `
        <div class="job">
          <div class="job-header">
            <span class="job-title">${exp.title}</span> @ ${exp.company}
            <div class="job-meta">${exp.startDate || ""} → ${exp.endDate || "Present"}</div>
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
    </div>
  `
      : ""
  }

  ${
    resume.education?.length
      ? `
    <div class="section">
      <h2>// EDUCATION</h2>
      ${resume.education
        .map(
          (edu) => `
        <div class="edu">
          <strong>${edu.degree}${edu.field ? ` - ${edu.field}` : ""}</strong><br>
          ${edu.institution} ${edu.graduationDate ? `(${edu.graduationDate})` : ""}
        </div>
      `,
        )
        .join("")}
    </div>
  `
      : ""
  }
</body>
</html>`
}
