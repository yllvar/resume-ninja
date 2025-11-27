import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { UserNav } from "@/components/user-nav"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/android-chrome-192x192.png"
            alt="Resume Ninja"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-lg font-bold text-foreground">Resume Ninja</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="/#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <UserNav user={user} />
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
