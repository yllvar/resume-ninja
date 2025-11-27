/**
 * Resume Parser Utilities
 * Handles client-side text extraction from PDF and DOCX files
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    return extractTextFromPDF(file)
  }

  if (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return extractTextFromDOCX(file)
  }

  if (fileType === "text/plain" || fileName.endsWith(".txt")) {
    return file.text()
  }

  throw new Error(`Unsupported file type: ${fileType || fileName}`)
}

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist")

    // Set worker source to local file with fallback
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`
    }

    const arrayBuffer = await file.arrayBuffer()
    
    // Configure loading task with error handling
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      // Disable worker if it fails to load
      disableWorker: false,
      // Enable standard font data
      standardFontDataUrl: false,
    })
    
    const pdf = await loadingTask.promise

    const textParts: string[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      textParts.push(pageText)
    }

    return textParts.join("\n\n")
  } catch (error) {
    console.error('PDF parsing error:', error)
    
    // Fallback: try without worker
    try {
      const pdfjsLib = await import("pdfjs-dist")
      
      // Disable worker for fallback
      const loadingTask = pdfjsLib.getDocument({ 
        data: await file.arrayBuffer(),
        disableWorker: true,
        standardFontDataUrl: false,
      })
      
      const pdf = await loadingTask.promise
      const textParts: string[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(" ")
        textParts.push(pageText)
      }

      return textParts.join("\n\n")
    } catch (fallbackError) {
      console.error('PDF fallback parsing failed:', fallbackError)
      throw new Error('Failed to parse PDF file. Please try uploading a different file or contact support.')
    }
  }
}

async function extractTextFromDOCX(file: File): Promise<string> {
  const mammoth = await import("mammoth")
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]
  const allowedExtensions = [".pdf", ".docx", ".txt"]

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" }
  }

  const hasValidType = allowedTypes.includes(file.type)
  const hasValidExtension = allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

  if (!hasValidType && !hasValidExtension) {
    return { valid: false, error: "Please upload a PDF, DOCX, or TXT file" }
  }

  return { valid: true }
}
