"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAdmin = session?.user.role === "admin"

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/services",
      label: "Services",
      active: pathname === "/services" || pathname.startsWith("/services/"),
    },
  ]

  const userRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/subscriptions",
      label: "My Subscriptions",
      active: pathname === "/dashboard/subscriptions" || pathname.startsWith("/dashboard/subscriptions/"),
    },
  ]

  const adminRoutes = [
    {
      href: "/admin",
      label: "Admin Dashboard",
      active: pathname === "/admin",
    },
    {
      href: "/admin/services",
      label: "Manage Services",
      active: pathname === "/admin/services" || pathname.startsWith("/admin/services/"),
    },
    {
      href: "/admin/subscriptions",
      label: "Manage Subscriptions",
      active: pathname === "/admin/subscriptions" || pathname.startsWith("/admin/subscriptions/"),
    },
    {
      href: "/admin/users",
      label: "Manage Users",
      active: pathname === "/admin/users" || pathname.startsWith("/admin/users/"),
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-sky-600">MobileWash</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                route.active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
          {session &&
            userRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  route.active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          {isAdmin &&
            adminRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  route.active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
        </nav>
        <div className="flex items-center ml-auto">
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.user.name}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/subscriptions">My Subscriptions</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(event) => {
                    event.preventDefault()
                    signOut({ callbackUrl: "/" })
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="ml-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <nav className="flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      route.active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
                {session &&
                  userRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        route.active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {route.label}
                    </Link>
                  ))}
                {isAdmin &&
                  adminRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        route.active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {route.label}
                    </Link>
                  ))}
                {!session && (
                  <Link
                    href="/auth/signin"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Sign In
                  </Link>
                )}
                {session && (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary text-left"
                  >
                    Sign Out
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
