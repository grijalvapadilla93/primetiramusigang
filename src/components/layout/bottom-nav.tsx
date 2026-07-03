"use client"

import { LayoutDashboard, Trophy, History } from "lucide-react"
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

export function BottomNav() {
  const { activeSection, setActiveSection } = useDashboard()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 glass-deep md:hidden">
      <div className="flex justify-around items-center px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,8px))]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-1 transition-all duration-200 active:scale-90 cursor-pointer",
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                isActive && "glass-strong bg-primary/10"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-label-caps mt-1",
                isActive && "font-bold"
              )}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
