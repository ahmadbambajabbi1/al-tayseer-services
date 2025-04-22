import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EnhancedSiteHeader } from "@/components/layout/enhanced-site-header"
import { AnimatedFooter } from "@/components/layout/animated-footer"
import { LayoutDashboard, Package, User } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (!session.user.onboardingCompleted) {
    redirect("/onboarding")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedSiteHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-8">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <nav className="flex h-full flex-col space-y-2 border-r pr-2 py-3">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{session.user.name}</h2>
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/subscriptions"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Package className="h-4 w-4" />
                  My Subscriptions
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </div>
            </div>
          </nav>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
      <AnimatedFooter />
    </div>
  )
}
