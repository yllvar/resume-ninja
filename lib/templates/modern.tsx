import type { OptimizedResume } from "@/lib/ai/schemas"

export function generateModernHTML(resume: Partial<OptimizedResume>): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      font-size: 10pt;
      line-height: 1.5;
      color: #2d2d2d;
      padding: 0.6in;
      max-width: 8.5in;
    }
    h1 { font-size: 24pt; font-weight: 300; margin-bottom: 4px; color: #1a1a1a; }
    h2 { 
      font-size: 9pt; 
      text-transform: uppercase; 
      letter-spacing: 2px;
      color: #666;
      margin: 18px 0 10px 0;
      font-weight: 500;
    }
    .contact { font-size: 9pt; color: #666; margin-bottom: 6px; }
    .contact a { color: #0066cc; text-decoration: none; }
    .divider { height: 2px; background: linear-gradient(to right, #1a1a1a, transparent); margin: 12px 0; }
    .summary { color: #444; margin-bottom: 8px; }
    .job { margin-bottom: 14px; }
    .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
    .job-title { font-weight: 600; font-size: 11pt; color: #1a1a1a; }
    .job-company { color: #666; font-size: 10pt; }
    .job-date { font-size: 9pt; color: #888; }
    .bullets { margin: 6px 0 0 0; padding-left: 16px; }
    .bullets li { margin-bottom: 3px; color: #444; }
    .edu { margin-bottom: 10px; }
    .edu-degree { font-weight: 600; color: #1a1a1a; }
    .skills { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill { 
      background: #f5f5f5; 
      padding: 4px 10px; 
      border-radius: 3px; 
      font-size: 9pt;
      color: #444;
    }
  </style>
</head>
<body>
  ${
    resume.contact
      ? `
    <h1>${resume.contact.name || "Your Name"}</h1>
    <p class="contact">
      ${[resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(" · ")}
      ${resume.contact.linkedin ? ` · <a href="${resume.contact.linkedin}">LinkedIn</a>` : ""}
      ${resume.contact.website ? ` · <a href="${resume.contact.website}">Portfolio</a>` : ""}
    </p>
    <div class="divider"></div>
  `
      : ""
  }

  ${
    resume.summary
      ? `
    <h2>About</h2>
    <p class="summary">${resume.summary}</p>
  `
      : ""
  }

  ${
    resume.experience?.length
      ? `
    <h2>Experience</h2>
    ${resume.experience
      .map(
        (exp) => `
      <div class="job">
        <div class="job-header">
          <div>
            <span class="job-title">${exp.title}</span>
            <span class="job-company"> at ${exp.company}</span>
          </div>
          <span class="job-date">${exp.startDate || ""} — ${exp.endDate || "Present"}</span>
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
        <span class="edu-degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</span>
        <span class="job-company"> · ${edu.institution}</span>
        ${edu.graduationDate ? `<span class="job-date"> · ${edu.graduationDate}</span>` : ""}
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
    <div class="skills">
      ${resume.skills.map((s) => `<span class="skill">${s}</span>`).join("")}
    </div>
  `
      : ""
  }
</body>
</html>`
}
