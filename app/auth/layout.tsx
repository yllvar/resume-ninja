import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - Resume Ninja",
  description: "Sign in or create an account to start optimizing your resume with AI",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
