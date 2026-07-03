"use client"

import { Crown, Flame, Star, TrendingUp, Calendar, Target, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakPanelProps {
  prime: number
  team: number
  pabloCurrent: number
  pabloLongest: number
  julioCurrent: number
  julioLongest: number
}

const weekDays = ["L", "M", "M", "J", "V", "S", "D"]

export function StreakPanel({
  prime,
  team,
  pabloCurrent,
  pabloLongest,
  julioCurrent,
  julioLongest,
}: StreakPanelProps) {
  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="w-[280px] h-[280px] bg-primary-fixed-dim/10 rounded-full blur-[120px] absolute top-[-30%] right-[-10%]" />
        <div className="w-[180px] h-[180px] bg-accent-julio/6 rounded-full blur-[80px] absolute bottom-[-5%] left-[-5%]" />
      </div>

      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-julio/15 to-accent-julio/5 flex items-center justify-center">
          <Crown className="w-5 h-5 text-accent-julio" />
        </div>
        <div>
          <h3 className="text-headline-md text-on-background font-bold">Rachas</h3>
          <p className="text-label-caps text-on-surface-variant uppercase tracking-wider">Tu progreso general</p>
        </div>
      </div>

      <div className="relative z-10 glass-strong rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-primary fill-primary" />
          </div>
          <div>
            <span className="text-label-caps text-primary font-bold uppercase tracking-wider">
              Racha Prime
            </span>
            <p className="text-body-sm text-on-surface-variant">Todos los hábitos al 100%</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold tracking-tighter text-on-background">{prime}</span>
          <span className="text-headline-md text-on-surface-variant font-medium">días</span>
        </div>
        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant bg-white/40 rounded-xl px-3 py-2">
          <Target className="w-4 h-4 text-primary flex-shrink-0" />
          <span>Completa <strong className="text-primary">todos</strong> los hábitos cada día para mantenerla</span>
        </div>
      </div>

      <div className="relative z-10 glass-strong rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent-pablo/10 flex items-center justify-center">
            <User className="w-5 h-5 text-accent-pablo" />
          </div>
          <div>
            <span className="text-label-caps text-accent-pablo font-bold uppercase tracking-wider">
              Rachas Personales
            </span>
            <p className="text-body-sm text-on-surface-variant">Cada quien su propio ritmo</p>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-pablo to-accent-pablo/70 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white/60">P</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-julio to-accent-julio/70 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white/60">J</div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tighter text-on-background">
                {pabloCurrent + julioCurrent}
              </span>
              <span className="text-body-sm text-on-surface-variant">días combinados</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-pablo flex items-center justify-center text-white text-[10px] font-bold">P</div>
                <span className="text-body-sm font-semibold text-on-surface">Pablo</span>
              </div>
              <span className="text-body-sm font-bold text-accent-pablo">{pabloCurrent} / {pabloLongest}</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
              <div className="h-2 rounded-full bg-gradient-to-r from-accent-pablo to-accent-pablo/50 transition-all" style={{ width: `${(pabloCurrent / pabloLongest) * 100}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-julio flex items-center justify-center text-white text-[10px] font-bold">J</div>
                <span className="text-body-sm font-semibold text-on-surface">Julio</span>
              </div>
              <span className="text-body-sm font-bold text-accent-julio">{julioCurrent} / {julioLongest}</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
              <div className="h-2 rounded-full bg-gradient-to-r from-accent-julio to-accent-julio/50 transition-all" style={{ width: `${(julioCurrent / julioLongest) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 glass-strong rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-secondary-fixed-dim/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-secondary-container" />
          </div>
          <div>
            <span className="text-label-caps text-secondary font-bold uppercase tracking-wider">
              Racha en Equipo
            </span>
            <p className="text-body-sm text-on-surface-variant">Ambos completando juntos</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold tracking-tighter text-on-background">{team}</span>
          <span className="text-headline-md text-on-surface-variant font-medium">días</span>
        </div>
        <p className="text-body-sm text-on-surface-variant flex items-center gap-1.5 bg-white/40 rounded-xl px-3 py-2">
          <Flame className="w-4 h-4 text-accent-julio" />
          Días donde ambos completaron todos sus hábitos
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-3 pt-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-on-surface-variant" />
          <span className="text-label-caps text-on-surface-variant uppercase tracking-widest">Progreso Semanal</span>
        </div>
        <div className="flex items-center gap-2 justify-between">
          {weekDays.map((day, i) => {
            const done = i < 4
            return (
              <div
                key={`wd-${i}`}
                className={cn(
                  "w-full py-2.5 rounded-xl flex items-center justify-center text-body-sm font-semibold transition-all",
                  done ? "glass-strong bg-primary/12 text-primary" : "glass text-on-surface-variant/40"
                )}
              >
                {day}
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-on-surface-variant flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Meta: 7/7 días
          </span>
          <div className="glass-strong rounded-lg px-3 py-1">
            <span className="text-body-sm font-bold text-primary">57%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
