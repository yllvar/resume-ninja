import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Mail, CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">Check your email</CardTitle>
          <CardDescription>We&apos;ve sent you a confirmation link to complete your registration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">What&apos;s next?</p>
                <p>Click the link in your email to verify your account. Then you can start optimizing your resume!</p>
              </div>
            </div>
          </div>
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
