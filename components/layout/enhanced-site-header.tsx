"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
import { Menu, User, LogOut, Settings, Package, Home, Package2, Users, LayoutDashboard } from "lucide-react"
import { APP_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function EnhancedSiteHeader() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAdmin = session?.user.role === "admin"
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for transparent header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      icon: Home,
    },
    {
      href: "/services",
      label: "Services",
      active: pathname === "/services" || pathname.startsWith("/services/"),
      icon: Package2,
    },
  ]

  const userRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/subscriptions",
      label: "My Subscriptions",
      active: pathname === "/dashboard/subscriptions" || pathname.startsWith("/dashboard/subscriptions/"),
      icon: Package,
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      active: pathname === "/dashboard/profile",
      icon: User,
    },
  ]

  const adminRoutes = [
    {
      href: "/admin",
      label: "Admin Dashboard",
      active: pathname === "/admin",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/services",
      label: "Manage Services",
      active: pathname === "/admin/services" || pathname.startsWith("/admin/services/"),
      icon: Package2,
    },
    {
      href: "/admin/subscriptions",
      label: "Manage Subscriptions",
      active: pathname === "/admin/subscriptions" || pathname.startsWith("/admin/subscriptions/"),
      icon: Package,
    },
    {
      href: "/admin/users",
      label: "Manage Users",
      active: pathname === "/admin/users" || pathname.startsWith("/admin/users/"),
      icon: Users,
    },
  ]

  // Determine if we're on the homepage to apply special styling
  const isHomepage = pathname === "/"

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isHomepage && !scrolled ? "bg-transparent border-transparent" : "bg-background border-b shadow-sm",
      )}
    >
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn("text-xl font-bold", isHomepage && !scrolled ? "text-white" : "text-sky-600")}
          >
            {APP_NAME}
          </motion.span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <AnimatePresence>
            {routes.map((route) => (
              <motion.div
                key={route.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-sky-600",
                    route.active
                      ? isHomepage && !scrolled
                        ? "text-white"
                        : "text-foreground"
                      : isHomepage && !scrolled
                        ? "text-sky-100"
                        : "text-muted-foreground",
                    "flex items-center gap-1",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              </motion.div>
            ))}

            {session &&
              userRoutes.map((route) => (
                <motion.div
                  key={route.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-sky-600",
                      route.active
                        ? isHomepage && !scrolled
                          ? "text-white"
                          : "text-foreground"
                        : isHomepage && !scrolled
                          ? "text-sky-100"
                          : "text-muted-foreground",
                      "flex items-center gap-1",
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                </motion.div>
              ))}

            {isAdmin &&
              adminRoutes.map((route) => (
                <motion.div
                  key={route.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-sky-600",
                      route.active
                        ? isHomepage && !scrolled
                          ? "text-white"
                          : "text-foreground"
                        : isHomepage && !scrolled
                          ? "text-sky-100"
                          : "text-muted-foreground",
                      "flex items-center gap-1",
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                </motion.div>
              ))}
          </AnimatePresence>
        </nav>
        <div className="flex items-center ml-auto">
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "relative h-10 w-10 rounded-full",
                    isHomepage && !scrolled && "text-white hover:bg-white/10",
                  )}
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.user.name}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/subscriptions" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    My Subscriptions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onSelect={(event) => {
                    event.preventDefault()
                    signOut({ callbackUrl: "/" })
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant={isHomepage && !scrolled ? "outline" : "default"}
              size="sm"
              className={cn(isHomepage && !scrolled && "border-white text-white hover:bg-white hover:text-sky-600")}
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "ml-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden",
                  isHomepage && !scrolled && "text-white hover:text-white hover:bg-white/20",
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <span className="text-xl font-bold text-sky-600">{APP_NAME}</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors hover:text-sky-600",
                      route.active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
                {session &&
                  userRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-sky-600",
                        route.active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <route.icon className="h-4 w-4" />
                      {route.label}
                    </Link>
                  ))}
                {isAdmin &&
                  adminRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-sky-600",
                        route.active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <route.icon className="h-4 w-4" />
                      {route.label}
                    </Link>
                  ))}
                {!session && (
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-sky-600"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                )}
                {session && (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700 text-left"
                  >
                    <LogOut className="h-4 w-4" />
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
