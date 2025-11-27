import type { OptimizedResume } from "@/lib/ai/schemas"

export function generateExecutiveHTML(resume: Partial<OptimizedResume>): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Georgia', serif; 
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 0.6in 0.75in;
      max-width: 8.5in;
    }
    .header { border-bottom: 3px solid #1a365d; padding-bottom: 12px; margin-bottom: 16px; }
    h1 { font-size: 22pt; color: #1a365d; margin-bottom: 4px; }
    h2 { 
      font-size: 12pt; 
      color: #1a365d;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
      margin: 16px 0 10px 0;
    }
    .contact { font-size: 10pt; color: #444; }
    .contact a { color: #1a365d; }
    .summary { 
      background: #f8f9fa; 
      padding: 12px; 
      border-left: 3px solid #1a365d; 
      margin-bottom: 12px;
      font-style: italic;
    }
    .job { margin-bottom: 14px; }
    .job-header { margin-bottom: 4px; }
    .job-title { font-weight: bold; font-size: 11pt; }
    .job-company { color: #1a365d; }
    .job-date { float: right; font-size: 10pt; color: #666; }
    .bullets { margin: 6px 0 0 20px; }
    .bullets li { margin-bottom: 4px; }
    .edu { margin-bottom: 8px; }
    .skills-section { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .skill-category { font-weight: bold; color: #1a365d; }
  </style>
</head>
<body>
  ${
    resume.contact
      ? `
    <div class="header">
      <h1>${resume.contact.name || "Your Name"}</h1>
      <p class="contact">
        ${[resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(" | ")}
        ${resume.contact.linkedin ? `<br><a href="${resume.contact.linkedin}">${resume.contact.linkedin}</a>` : ""}
      </p>
    </div>
  `
      : ""
  }

  ${
    resume.summary
      ? `
    <h2>Executive Summary</h2>
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
        <div class="job-header">
          <span class="job-date">${exp.startDate || ""} – ${exp.endDate || "Present"}</span>
          <span class="job-title">${exp.title}</span><br>
          <span class="job-company">${exp.company}</span>
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
    <h2>Education & Credentials</h2>
    ${resume.education
      .map(
        (edu) => `
      <div class="edu">
        <strong>${edu.degree}${edu.field ? `, ${edu.field}` : ""}</strong><br>
        ${edu.institution}${edu.graduationDate ? ` | ${edu.graduationDate}` : ""}
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
    <h2>Core Competencies</h2>
    <p>${resume.skills.join(" • ")}</p>
  `
      : ""
  }
</body>
</html>`
}
