"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we have the necessary hash parameters for password reset
    const hashParams = searchParams.get('hash')
    if (!hashParams) {
      setError("Invalid or expired reset link")
    }
  }, [searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })
      if (error) throw error
      setIsSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Image
            src="/images/android-chrome-192x192.png"
            alt="Resume Ninja"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-foreground">Resume Ninja</span>
        </Link>

        <Card className="w-full max-w-sm border-border bg-card text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-foreground">Password updated</CardTitle>
            <CardDescription>
              Your password has been successfully reset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">Sign in with new password</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Image
          src="/images/android-chrome-192x192.png"
          alt="Resume Ninja"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="text-xl font-bold text-foreground">Resume Ninja</span>
      </Link>

      <Card className="w-full max-w-sm border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Set new password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
              {error && <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <Link href="/auth/login" className="inline-flex items-center text-primary underline underline-offset-4">
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
