"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Trophy,
  History,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: Trophy },
  { href: "/history", label: "History", icon: History },
  { href: "/profile", label: "Profile", icon: User },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex flex-col h-full p-6 gap-4 bg-surface/70 backdrop-blur-[24px] dark:bg-surface-container-high/70 border-r border-white/20 shadow-xl fixed left-0 top-0 z-40 w-64">
      <div className="mb-stack-lg flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-lg shadow-md">
          MP
        </div>
        <div>
          <h2 className="text-headline-md text-primary dark:text-inverse-primary font-bold tracking-tight">
            Modo Prime
          </h2>
          <p className="text-body-sm text-on-surface-variant">Pablo & Julio</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors text-body-lg",
                isActive
                  ? "text-primary font-bold bg-primary/10"
                  : "text-on-surface-variant hover:text-primary hover:bg-white/20"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
