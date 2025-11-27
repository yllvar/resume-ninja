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
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push(redirectTo)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
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
          <CardTitle className="text-2xl text-foreground">Welcome back</CardTitle>
          <CardDescription>Sign in to continue optimizing your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ninja@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
              {error && <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-center text-sm text-muted-foreground">
              <div>
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary underline underline-offset-4">
                  Sign up
                </Link>
              </div>
              <div>
                <Link href="/auth/forgot-password" className="text-primary underline underline-offset-4">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
