"use client"

import { TrendingUp, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

export function WeekComparison({ thisWeek, lastWeek }: { thisWeek: number; lastWeek: number }) {
  const diff = thisWeek - lastWeek
  const pct = lastWeek > 0 ? Math.round((diff / lastWeek) * 100) : 0

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Vs. Semana Pasada</span>
      </div>
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-label-caps text-on-surface-variant">Pasada</span>
          <div className="w-full h-20 rounded-xl bg-white/10 flex items-end overflow-hidden">
            <div className="w-full bg-accent-pablo/40 rounded-xl transition-all" style={{ height: `${Math.min(100, (lastWeek / 20) * 100)}%` }} />
          </div>
          <span className="text-body-sm font-bold text-on-surface">{lastWeek}</span>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-label-caps text-on-surface-variant">Esta</span>
          <div className="w-full h-20 rounded-xl bg-white/10 flex items-end overflow-hidden">
            <div className={cn("w-full rounded-xl transition-all", diff > 0 ? "bg-accent-pablo" : "bg-accent-julio")} style={{ height: `${Math.min(100, (thisWeek / 20) * 100)}%` }} />
          </div>
          <span className="text-body-sm font-bold text-on-surface">{thisWeek}</span>
        </div>
      </div>
      {diff !== 0 && (
        <div className="flex items-center justify-center gap-1.5 text-body-sm">
          <TrendingUp className={cn("w-4 h-4", diff > 0 ? "text-accent-pablo" : "text-accent-julio")} />
          <span className={cn("font-bold", diff > 0 ? "text-accent-pablo" : "text-accent-julio")}>
            {diff > 0 ? "+" : ""}{diff} ({diff > 0 ? "+" : ""}{pct}%)
          </span>
          <span className="text-on-surface-variant">{diff > 0 ? "más" : "menos"} que la semana pasada</span>
        </div>
      )}
    </div>
  )
}
