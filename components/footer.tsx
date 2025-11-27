import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/android-chrome-192x192.png"
              alt="Resume Ninja"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-foreground">Resume Ninja</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Resume Ninja. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
