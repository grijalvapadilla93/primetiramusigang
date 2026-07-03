"use client"

import { Clock, Dumbbell, Droplet, Pill, StretchVertical, Sparkles, Moon, SprayCan } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedEntry {
  user: "pablo" | "julio"
  habitId: string
  time: string
}

const habitIcons: Record<string, React.ElementType> = {
  entrenamiento: Dumbbell, vitaminas: Pill, estiramiento: StretchVertical,
  "sin-azucar": Sparkles, sueno: Moon, skincare: SprayCan, agua: Droplet,
}

const habitLabels: Record<string, string> = {
  entrenamiento: "Entrenamiento", vitaminas: "Vitaminas", estiramiento: "Estiramiento",
  "sin-azucar": "Sin Azúcar", sueno: "Sueño", skincare: "Skincare", agua: "Agua",
}

const recentEntries: FeedEntry[] = [
  { user: "pablo", habitId: "entrenamiento", time: "7:30 AM" },
  { user: "julio", habitId: "vitaminas", time: "8:15 AM" },
  { user: "pablo", habitId: "sin-azucar", time: "9:00 AM" },
  { user: "julio", habitId: "agua", time: "10:30 AM" },
  { user: "pablo", habitId: "agua", time: "11:00 AM" },
]

export function RecentFeed() {
  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Actividad reciente</span>
      </div>
      <div className="flex flex-col gap-2">
        {recentEntries.map((e, i) => {
          const Icon = habitIcons[e.habitId]
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", e.user === "pablo" ? "bg-accent-pablo/15" : "bg-accent-julio/15")}>
                {Icon && <Icon className={cn("w-3.5 h-3.5", e.user === "pablo" ? "text-accent-pablo" : "text-accent-julio")} />}
              </div>
              <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0", e.user === "pablo" ? "bg-accent-pablo" : "bg-accent-julio")}>
                {e.user === "pablo" ? "P" : "J"}
              </span>
              <p className="text-body-sm text-on-surface flex-1 min-w-0 truncate">
                <span className="font-semibold">{e.user === "pablo" ? "Pablo" : "Julio"}</span> completó <span className="font-semibold">{habitLabels[e.habitId]}</span>
              </p>
              <span className="text-label-caps text-on-surface-variant flex-shrink-0">{e.time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
