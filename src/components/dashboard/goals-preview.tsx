"use client"

import { Trophy, Heart, Book, Target, Clock, Users, ArrowRight } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, React.ElementType> = {
  salud: Heart,
  aprendizaje: Book,
  viaje: Target,
  otro: Target,
}

const categoryLabels: Record<string, string> = {
  salud: "Salud",
  ahorro: "Ahorro",
  aprendizaje: "Aprendizaje",
  viaje: "Viaje",
  otro: "Otro",
}

export function GoalsPreview() {
  const { goals, setActiveSection } = useDashboard()
  const completedGoals = goals.filter((g) => g.progress >= 100).length
  const previewGoals = goals.slice(0, 3)

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col gap-5 transition-all duration-300 border-l-[3px] border-l-primary relative overflow-hidden min-h-[260px]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="w-[300px] h-[300px] bg-primary-fixed-dim/8 rounded-full blur-[100px] absolute top-[-30%] right-[-20%]" />
        <div className="w-[200px] h-[200px] bg-secondary-fixed-dim/8 rounded-full blur-[60px] absolute bottom-[-20%] left-[-10%]" />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-headline-md text-on-background font-bold">Metas Activas</h3>
            <p className="text-body-sm text-on-surface-variant">
              {completedGoals} de {goals.length} completadas
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveSection("goals")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-strong text-primary hover:bg-primary/5 transition-all text-label-caps font-semibold cursor-pointer"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative z-10 flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {previewGoals.map((goal, i) => {
          const Icon = categoryIcons[goal.category] || Target
          const isPending = goal.status === "pending"
          return (
            <div
              key={`${goal.name}-${i}`}
              className={cn(
                "flex-none w-full sm:w-56 rounded-2xl p-4 flex flex-col gap-3 border",
                isPending
                  ? "glass border-dashed border-outline-variant/50"
                  : "glass-strong"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center",
                  isPending ? "bg-outline-variant/20" : "bg-primary/8"
                )}>
                  <Icon className={cn("w-4 h-4", isPending ? "text-outline-variant" : "text-primary")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-body-sm font-semibold truncate", isPending ? "text-on-surface-variant" : "text-on-surface")}>{goal.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">{categoryLabels[goal.category]}</span>
                    {goal.owner === "conjunta" && (
                      <Users className="w-3 h-3 text-on-surface-variant" />
                    )}
                  </div>
                </div>
              </div>

              {isPending ? (
                <div className="flex items-center gap-1.5 bg-outline-variant/10 rounded-lg px-2.5 py-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent-julio" />
                  <span className="text-label-caps text-accent-julio font-semibold uppercase tracking-wider">Pendiente</span>
                </div>
              ) : (
                <>
                  <p className="text-body-sm text-on-surface-variant truncate">{goal.target}</p>
                  <div className="w-full bg-white/60 rounded-full h-2.5 overflow-hidden">
                    <div className={`${goal.color} h-2.5 rounded-full transition-all`} style={{ width: `${goal.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Progreso</span>
                    <span className="text-body-sm font-bold text-primary">{goal.progress}%</span>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
