"use client"

import { useState } from "react"
import { Trophy, Plus, X, Heart, Book, Target, Users, Hash, DollarSign, Repeat, BarChart3, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemListInput } from "@/components/ui/item-list-input"
import { cn } from "@/lib/utils"
import { useDashboard, type Goal, type GoalType } from "@/lib/dashboard-context"

const categoryIcons: Record<string, React.ElementType> = {
  salud: Heart,
  aprendizaje: Book,
  viaje: Target,
  otro: Target,
}

const categoryLabels: Record<string, string> = {
  salud: "Salud",
  aprendizaje: "Aprendizaje",
  viaje: "Viaje",
  otro: "Otro",
}

const goalTypeMeta: Record<GoalType, { icon: React.ElementType; label: string; desc: string; progressLabel: string }> = {
  daily: { icon: Repeat, label: "Por días", desc: "Racha con duración definida", progressLabel: "día completado" },
  project: { icon: BarChart3, label: "Por pasos", desc: "Avanzas por porcentaje o hitos", progressLabel: "paso completado" },
}

export function NewGoalModal() {
  const { showGoalModal, setShowGoalModal, goals, setGoals, currentUser } = useDashboard()
  const [name, setName] = useState("")
  const [owner, setOwner] = useState<"pablo" | "julio" | "conjunta">(currentUser)
  const [category, setCategory] = useState("salud")
  const [goalType, setGoalType] = useState<GoalType>("daily")
  const [needsMoney, setNeedsMoney] = useState(false)
  const [targetAmount, setTargetAmount] = useState("")
  const [durationDays, setDurationDays] = useState("30")
  const [whatItems, setWhatItems] = useState<string[]>([])
  const [needsItems, setNeedsItems] = useState<string[]>([])
  const [showNeeds, setShowNeeds] = useState(false)

  if (!showGoalModal) return null

  const handleAdd = () => {
    if (!name.trim()) return
    const whatStr = whatItems.join("\n")
    const neededStr = needsItems.join("\n")
    const dur = goalType === "daily" ? parseInt(durationDays) || 30 : undefined
    const amt = needsMoney ? parseInt(targetAmount) || 0 : 0
    const targetStr = goalType === "daily"
      ? `Día 0 / ${dur}`
      : "0% completado"
    const color = category === "salud" ? "bg-primary" : category === "aprendizaje" ? "bg-accent-pablo" : category === "viaje" ? "bg-secondary-container" : "bg-tertiary-container"
    const newGoal: Goal = {
      name,
      owner,
      category,
      goalType,
      needsMoney,
      targetAmount: amt > 0 ? amt : undefined,
      durationDays: dur,
      what: whatStr,
      needed: neededStr,
      checklist: whatItems.length > 0 ? whatItems.map((text) => ({ text, done: false })) : [{ text: name, done: false }],
      needsList: needsItems.length > 0 ? needsItems.map((text) => ({ text, done: false })) : [],
      progress: 0,
      target: targetStr,
      color,
      status: owner === "conjunta" ? "pending" : "active",
      entries: [],
    }
    setGoals([...goals, newGoal])
    setName("")
    setOwner(currentUser)
    setCategory("salud")
    setGoalType("daily")
    setNeedsMoney(false)
    setTargetAmount("")
    setDurationDays("30")
    setWhatItems([])
    setNeedsItems([])
    setShowNeeds(false)
    setShowGoalModal(false)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={() => setShowGoalModal(false)} />
      <div className="relative glass-deep rounded-3xl p-6 max-w-md w-full flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-headline-md font-bold text-on-background">Nueva Meta</h3>
          </div>
          <button onClick={() => setShowGoalModal(false)} className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Nombre</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Viaje a Japón" className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 px-4 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Propietario</span>
            <div className="grid grid-cols-3 gap-2">
              {(["pablo", "julio", "conjunta"] as const).map((o) => {
                const isPablo = o === "pablo"
                const isJulio = o === "julio"
                return (
                  <button key={o} onClick={() => setOwner(o)} className={cn("flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all", owner === o ? cn("glass-strong ring-2", isPablo ? "bg-accent-pablo/10 text-accent-pablo ring-accent-pablo/30" : isJulio ? "bg-accent-julio/10 text-accent-julio ring-accent-julio/30" : "bg-primary/10 text-primary ring-primary/30") : "glass text-on-surface-variant hover:text-primary")}>
                    {isPablo ? <div className="w-7 h-7 rounded-full bg-accent-pablo flex items-center justify-center text-white text-xs font-bold">P</div> : isJulio ? <div className="w-7 h-7 rounded-full bg-accent-julio flex items-center justify-center text-white text-xs font-bold">J</div> : <Users className="w-5 h-5" />}
                    <span className="text-label-caps">{isPablo ? "Pablo" : isJulio ? "Julio" : "Ambos"}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Categoría</span>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const Icon = categoryIcons[key]
                return (
                  <button key={key} onClick={() => setCategory(key)} className={cn("flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl transition-all", category === key ? "glass-strong bg-primary/10 text-primary ring-2 ring-primary/30" : "glass text-on-surface-variant hover:text-primary")}>
                    <Icon className="w-5 h-5" />
                    <span className="text-label-caps">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Tipo de seguimiento</span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(goalTypeMeta) as [GoalType, typeof goalTypeMeta.daily][]).map(([key, meta]) => {
                const Icon = meta.icon
                return (
                  <button key={key} onClick={() => setGoalType(key)} className={cn("flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl transition-all", goalType === key ? "glass-strong bg-primary/10 text-primary ring-2 ring-primary/30" : "glass text-on-surface-variant hover:text-primary")}>
                    <Icon className="w-5 h-5" />
                    <span className="text-body-sm font-bold">{meta.label}</span>
                    <span className="text-label-caps text-on-surface-variant/60 text-center leading-tight">{meta.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {goalType === "daily" && (
            <div className="flex flex-col gap-1.5">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Duración</span>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder="30" className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 pl-10 pr-4 text-body-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">¿Qué hay que hacer?</span>
            <ItemListInput items={whatItems} onChange={setWhatItems} placeholder="Ej: Correr 3 veces por semana" emptyLabel="Agrega los pasos necesarios..." />
          </div>

          <div className="flex items-center gap-3 py-1">
            <button onClick={() => setShowNeeds(!showNeeds)} className={cn("relative w-11 h-6 rounded-full transition-all flex-shrink-0", showNeeds ? "bg-primary" : "bg-white/40")}>
              <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all", showNeeds ? "left-[calc(100%-22px)]" : "left-0.5")} />
            </button>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-on-surface-variant" />
              <span className="text-body-sm font-semibold text-on-surface">¿Tienes que preparar algo mientras?</span>
            </div>
          </div>

          {showNeeds && (
            <ItemListInput items={needsItems} onChange={setNeedsItems} placeholder="Ej: Zapatos cómodos" emptyLabel="Agrega lo que necesitas conseguir..." />
          )}

          <div className="flex items-center gap-3 py-1">
            <button onClick={() => setNeedsMoney(!needsMoney)} className={cn("relative w-11 h-6 rounded-full transition-all flex-shrink-0", needsMoney ? "bg-primary" : "bg-white/40")}>
              <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all", needsMoney ? "left-[calc(100%-22px)]" : "left-0.5")} />
            </button>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-on-surface-variant" />
              <span className="text-body-sm font-semibold text-on-surface">¿Requiere ahorrar dinero?</span>
            </div>
          </div>

          {needsMoney && (
            <div className="flex flex-col gap-1.5">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Meta de ahorro</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-sm text-on-surface-variant font-semibold">$</span>
                <input type="number" min={1} value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="0" className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 pl-8 pr-4 text-body-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          )}

          {owner === "conjunta" && (
            <div className="glass-strong rounded-2xl p-3 flex items-start gap-2.5">
              <Users className="w-4 h-4 text-accent-julio flex-shrink-0 mt-0.5" />
              <p className="text-body-sm text-on-surface-variant">Las metas conjuntas requieren aprobación de ambos.</p>
            </div>
          )}
        </div>

        <Button variant="default" size="lg" className="w-full rounded-2xl" onClick={handleAdd} disabled={!name.trim()}>
          <Plus className="w-4 h-4" />
          Crear Meta
        </Button>
      </div>
    </div>
  )
}
