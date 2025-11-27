"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { extractTextFromFile, validateResumeFile } from "@/lib/resume-parser"

interface ResumeDropzoneProps {
  onTextExtracted: (text: string, fileName: string) => void
  isProcessing?: boolean
  className?: string
}

export function ResumeDropzone({ onTextExtracted, isProcessing, className }: ResumeDropzoneProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      const validation = validateResumeFile(file)
      if (!validation.valid) {
        setError(validation.error || "Invalid file")
        return
      }

      setFile(file)
      setError(null)
      setIsParsing(true)

      try {
        const text = await extractTextFromFile(file)
        if (!text || text.trim().length < 50) {
          throw new Error("Could not extract enough text from the file. Please try a different format.")
        }
        onTextExtracted(text, file.name)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse file")
        setFile(null)
      } finally {
        setIsParsing(false)
      }
    },
    [onTextExtracted],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0])
      }
    },
    [processFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: isParsing || isProcessing,
  })

  const clearFile = () => {
    setFile(null)
    setError(null)
  }

  const isLoading = isParsing || isProcessing

  return (
    <div className={className}>
      {!file ? (
        <Card
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed p-8 transition-colors cursor-pointer",
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-card",
            isLoading && "pointer-events-none opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground">
              {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">or click to browse (PDF, DOCX, TXT)</p>
            <p className="mt-1 text-xs text-muted-foreground">Max file size: 5MB</p>
          </div>
        </Card>
      ) : (
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <FileText className="h-5 w-5 text-primary" />
            )}
            <div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">{isLoading ? "Processing..." : "Ready for analysis"}</p>
            </div>
          </div>
          {!isLoading && (
            <Button variant="ghost" size="icon" onClick={clearFile}>
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          )}
        </Card>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
