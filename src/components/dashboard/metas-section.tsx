"use client"

import { useState } from "react"
import { Trophy, Edit3, TrendingUp, Check, X, Users, Heart, Book, Target } from "lucide-react"
import { useDashboard, type Goal } from "@/lib/dashboard-context"
import { ProgressModal } from "@/components/dashboard/progress-modal"
import { EditGoalModal } from "@/components/dashboard/edit-goal-modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, React.ElementType> = {
  salud: Heart,
  aprendizaje: Book,
  viaje: Target,
  otro: Target,
}

function GoalCard({ goal, goalIndex }: { goal: Goal; goalIndex: number }) {
  const { currentUser } = useDashboard()
  const [showProgress, setShowProgress] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const Icon = categoryIcons[goal.category] || Trophy
  const isPending = goal.status === "pending"
  const canEdit = goal.owner === currentUser || goal.owner === "conjunta"

  return (
    <>
      <div className={cn(
        "rounded-2xl p-5 flex flex-col gap-3 transition-all",
        isPending ? "glass border-2 border-dashed border-accent-julio/40" : "glass-card"
      )}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", `${goal.color}/10`)}>
              <Icon className="w-5 h-5" style={{ color: `var(--${goal.color.replace("bg-", "")})` }} />
            </div>
            <div className="min-w-0">
              <h4 className="text-body-md font-bold text-on-surface truncate">{goal.name}</h4>
              <p className="text-label-caps text-on-surface-variant">{goal.target}</p>
            </div>
          </div>
          {canEdit && !isPending && (
            <button
              onClick={() => setShowEdit(true)}
              className="w-7 h-7 rounded-lg glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary flex-shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {(goal.what || goal.needed) && (
          <p className="text-body-sm text-on-surface-variant line-clamp-2">
            {goal.what}{goal.what && goal.needed ? " — " : ""}{goal.needed}
          </p>
        )}

        {isPending && (
          <div className="flex items-center gap-2">
            <div className="glass-strong rounded-lg px-2.5 py-1 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-accent-julio" />
              <span className="text-label-caps text-accent-julio">Pendiente</span>
            </div>
            {canEdit && (
              <div className="flex gap-1 ml-auto">
                <button className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all cursor-pointer">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {!isPending && (
          <>
            <div className="flex items-center gap-2.5">
              <div className="flex-1 h-2 rounded-full bg-white/30 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", goal.color)}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className="text-label-caps font-bold text-primary flex-shrink-0">{goal.progress}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {goal.entries.length > 0 && (
                  <span className="text-label-caps text-on-surface-variant">{goal.entries.length} registro{goal.entries.length !== 1 ? "s" : ""}</span>
                )}
                {goal.checklist.length > 0 && (
                  <span className="text-label-caps text-on-surface-variant">
                    {goal.checklist.filter((i) => i.done).length}/{goal.checklist.length} pasos
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowProgress(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-[0.97] transition-all text-label-caps font-bold cursor-pointer shadow-sm"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Progresar
              </button>
            </div>
          </>
        )}
      </div>

      {showProgress && (
        <ProgressModal goal={goal} goalIndex={goalIndex} onClose={() => setShowProgress(false)} />
      )}
      {showEdit && (
        <EditGoalModal goal={goal} goalIndex={goalIndex} onClose={() => setShowEdit(false)} />
      )}
    </>
  )
}

function OwnerSection({
  owner,
  label,
  icon: Icon,
  accent,
}: {
  owner: string
  label: string
  icon: React.ElementType
  accent: string
}) {
  const { goals, setShowGoalModal } = useDashboard()
  const userGoals = goals
    .map((g, i) => ({ goal: g, index: i }))
    .filter(({ goal }) => goal.owner === owner)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", accent)}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-headline-sm font-bold text-on-background">{label}</h3>
        <span className="text-label-caps text-on-surface-variant ml-auto">{userGoals.length} meta{userGoals.length !== 1 ? "s" : ""}</span>
      </div>

      {userGoals.length === 0 ? (
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-2 text-center">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", accent.replace("bg-", "bg-/20 "))}>
            <Icon className="w-6 h-6 text-white/60" />
          </div>
          <p className="text-body-sm text-on-surface-variant">Sin metas aún</p>
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setShowGoalModal(true)}>
            + Crear meta
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {userGoals.map(({ goal, index }) => (
            <GoalCard key={`${goal.name}-${index}`} goal={goal} goalIndex={index} />
          ))}
        </div>
      )}
    </div>
  )
}

export function MetasSection() {
  const { goals, currentUser } = useDashboard()
  const [showArchive, setShowArchive] = useState(false)
  const [showTeamView, setShowTeamView] = useState(false)

  const completedGoals = goals.filter((g) => g.progress >= 100)
  const activeGoals = goals.filter((g) => g.progress < 100)

  const partner = currentUser === "pablo" ? "julio" : "pablo"
  const partnerGoals = goals.filter((g) => g.owner === partner)
  const commonGoals = goals.filter((g) => g.owner === "conjunta")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent-pablo flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-headline-lg font-bold text-on-background tracking-tight">Metas</h2>
          <p className="text-body-sm text-on-surface-variant">Organiza tus metas personales y conjuntas</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setShowTeamView(!showTeamView)} className={cn("px-4 py-2 rounded-xl text-label-caps font-bold transition-all cursor-pointer", showTeamView ? "glass-strong bg-primary/10 text-primary ring-2 ring-primary/30" : "glass text-on-surface-variant hover:text-primary")}>
          <Users className="w-3.5 h-3.5 inline mr-1.5" />
          Progreso del equipo
        </button>
        {completedGoals.length > 0 && (
          <button onClick={() => setShowArchive(!showArchive)} className={cn("px-4 py-2 rounded-xl text-label-caps font-bold transition-all cursor-pointer", showArchive ? "glass-strong bg-accent-julio/10 text-accent-julio ring-2 ring-accent-julio/30" : "glass text-on-surface-variant hover:text-primary")}>
            <Check className="w-3.5 h-3.5 inline mr-1.5" />
            Completadas ({completedGoals.length})
          </button>
        )}
      </div>

      {showTeamView && (
        <div className="glass-card rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-headline-sm font-bold text-on-background">Progreso del equipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-accent-pablo" />
                <span className="text-label-caps text-accent-pablo font-bold uppercase">Pablo</span>
              </div>
              {partnerGoals.length === 0 && commonGoals.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant/60 italic">Sin metas compartidas aún</p>
              ) : (
                [...partnerGoals, ...commonGoals].map((g, i) => (
                  <div key={i} className="glass-strong rounded-xl px-3 py-2 flex items-center gap-2">
                    <span className="text-label-caps text-on-surface-variant flex-shrink-0">{g.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                      <div className={`${g.color} h-full rounded-full`} style={{ width: `${g.progress}%` }} />
                    </div>
                    <span className="text-label-caps font-bold text-primary flex-shrink-0">{g.progress}%</span>
                  </div>
                ))
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-accent-julio" />
                <span className="text-label-caps text-accent-julio font-bold uppercase">Julio</span>
              </div>
              {partner === "julio" && [...partnerGoals, ...commonGoals].length === 0 ? (
                <p className="text-body-sm text-on-surface-variant/60 italic">Sin metas compartidas aún</p>
              ) : (
                [...(partner === "pablo" ? goals.filter((g) => g.owner === "pablo") : partnerGoals), ...commonGoals].map((g, i) => (
                  <div key={i} className="glass-strong rounded-xl px-3 py-2 flex items-center gap-2">
                    <span className="text-label-caps text-on-surface-variant flex-shrink-0">{g.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                      <div className={`${g.color} h-full rounded-full`} style={{ width: `${g.progress}%` }} />
                    </div>
                    <span className="text-label-caps font-bold text-primary flex-shrink-0">{g.progress}%</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        <OwnerSection owner="pablo" label="Pablo" icon={Heart} accent="bg-accent-pablo" />
        <OwnerSection owner="julio" label="Julio" icon={Heart} accent="bg-accent-julio" />
        <OwnerSection owner="conjunta" label="Conjunto" icon={Users} accent="bg-gradient-to-br from-primary to-accent-pablo" />
      </div>

      {showArchive && completedGoals.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-julio/15 flex items-center justify-center">
              <Check className="w-4 h-4 text-accent-julio" />
            </div>
            <h3 className="text-headline-sm font-bold text-on-background">Completadas</h3>
            <span className="text-label-caps text-on-surface-variant ml-auto">{completedGoals.length} meta{completedGoals.length !== 1 ? "s" : ""}</span>
          </div>
          {completedGoals.map((goal, i) => {
            const realIndex = goals.indexOf(goal)
            const Icon = categoryIcons[goal.category] || Trophy
            return (
              <div key={i} className="glass rounded-2xl p-4 flex items-center gap-3 opacity-70">
                <div className="w-9 h-9 rounded-xl bg-accent-julio/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-accent-julio" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-bold text-on-surface truncate">{goal.name}</p>
                  <p className="text-label-caps text-on-surface-variant">Completada — {goal.entries.length} registro{goal.entries.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-1.5 text-accent-julio">
                  <Check className="w-4 h-4" />
                  <span className="text-label-caps font-bold">100%</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
