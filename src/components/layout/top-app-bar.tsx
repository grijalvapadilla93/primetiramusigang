"use client"

import { LayoutDashboard, Trophy, History, Flame, Bell } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Casita", icon: LayoutDashboard },
  { id: "goals", label: "Metas", icon: Trophy },
  { id: "history", label: "Historial", icon: History },
]

export function TopAppBar() {
  const { activeSection, setActiveSection } = useDashboard()

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-deep">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-sm shadow-sm">
            MP
          </div>
          <span className="text-headline-md text-primary font-bold tracking-tight hidden sm:block">
            Modo Prime
          </span>
        </div>

        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-body-sm font-semibold cursor-pointer",
                  isActive
                    ? "glass-strong bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex w-9 h-9 rounded-xl glass-strong items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
            <Flame className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm border border-white/40 shadow-sm">
            P
          </div>
        </div>
      </div>
    </header>
  )
}
