"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, LayoutDashboard, Package, Settings, ShoppingCart, Tag, Timer, Users } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/admin",
    },
    {
      href: "/admin/services",
      label: "Services",
      icon: <Package className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/services",
    },
    {
      href: "/admin/services/categories",
      label: "Categories",
      icon: <Tag className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/services/categories",
    },
    {
      href: "/admin/services/periods",
      label: "Periods",
      icon: <Timer className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/services/periods",
    },
    {
      href: "/admin/subscriptions",
      label: "Subscriptions",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/subscriptions",
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/users",
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/analytics",
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="flex min-h-screen">
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-64 flex-col border-r bg-background transition-transform lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center border-b px-4 lg:h-16">
          <Link href="/admin" className="flex items-center font-semibold">
            Admin Dashboard
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {routes.map((route) => (
              <Button key={route.href} asChild variant={route.active ? "secondary" : "ghost"} className="justify-start">
                <Link href={route.href}>
                  {route.icon}
                  {route.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
