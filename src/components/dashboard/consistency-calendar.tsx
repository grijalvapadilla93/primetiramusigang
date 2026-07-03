import { Calendar, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const days = [20, 40, 60, 100, 20, 0, 80, 40, 60, 100, 80, 0, 40, 60]

export function ConsistencyCalendar() {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg transition-all group cursor-pointer">
      <div className="flex items-center justify-between">
        <h3 className="text-headline-md text-on-background flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Consistencia 14 Días
        </h3>
        <ArrowRight className="w-5 h-5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
      </div>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2">
        {days.map((intensity, i) => (
          <div
            key={i}
            className={cn(
              "w-6 h-6 rounded-md transition-colors",
              intensity === 0 && "bg-surface-variant",
              intensity > 0 && intensity <= 25 && "bg-tertiary-fixed-dim/20",
              intensity > 25 && intensity <= 50 && "bg-tertiary-fixed-dim/40",
              intensity > 50 && intensity <= 75 && "bg-tertiary-fixed-dim/60",
              intensity > 75 && "bg-tertiary-fixed-dim"
            )}
          />
        ))}
      </div>
    </div>
  )
}
