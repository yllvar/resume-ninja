import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { AlertTriangle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-foreground">Authentication Error</CardTitle>
          <CardDescription>Something went wrong during authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {params?.error && (
            <div className="rounded-lg bg-destructive/10 p-4">
              <p className="text-sm text-destructive">Error: {params.error}</p>
            </div>
          )}
          <Button asChild className="w-full">
            <Link href="/auth/login">Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
