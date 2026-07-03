"use client"

import { useState } from "react"
import { Trophy, X, Heart, Book, Target, Users, Save, Hash, DollarSign, Repeat, BarChart3, Package } from "lucide-react"
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

const goalTypeMeta: Record<GoalType, { icon: React.ElementType; label: string }> = {
  daily: { icon: Repeat, label: "Por días" },
  project: { icon: BarChart3, label: "Por pasos" },
}

interface EditGoalModalProps {
  goal: Goal
  goalIndex: number
  onClose: () => void
}

export function EditGoalModal({ goal, goalIndex, onClose }: EditGoalModalProps) {
  const { goals, setGoals } = useDashboard()
  const [name, setName] = useState(goal.name)
  const [owner, setOwner] = useState(goal.owner)
  const [category, setCategory] = useState(goal.category)
  const [goalType, setGoalType] = useState<GoalType>(goal.goalType)
  const [needsMoney, setNeedsMoney] = useState(goal.needsMoney)
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount?.toString() || "")
  const [durationDays, setDurationDays] = useState(goal.durationDays?.toString() || "30")
  const [whatItems, setWhatItems] = useState(goal.checklist.map((i) => i.text))
  const [needsItems, setNeedsItems] = useState(goal.needsList.map((i) => i.text))
  const [showNeeds, setShowNeeds] = useState(goal.needsList.length > 0)

  const handleSave = () => {
    if (!name.trim()) return
    const updated = [...goals]
    const g = { ...updated[goalIndex] }

    const whatStr = whatItems.join("\n")
    const neededStr = needsItems.join("\n")
    const dur = goalType === "daily" ? parseInt(durationDays) || 30 : undefined
    const amt = needsMoney ? parseInt(targetAmount) || 0 : 0

    let targetStr = g.target
    if (goalType !== g.goalType) {
      targetStr = goalType === "daily"
        ? `Día ${g.progress} / ${dur}`
        : `${g.progress}% completado`
    }

    g.name = name
    g.owner = owner
    g.category = category
    g.goalType = goalType
    g.needsMoney = needsMoney
    g.targetAmount = amt > 0 ? amt : undefined
    g.durationDays = dur
    g.what = whatStr
    g.needed = neededStr
    g.target = targetStr
    g.color = category === "salud" ? "bg-primary" : category === "aprendizaje" ? "bg-accent-pablo" : category === "viaje" ? "bg-secondary-container" : "bg-tertiary-container"
    g.status = owner === "conjunta" ? "pending" : "active"
    g.checklist = whatItems.length > 0 ? whatItems.map((text) => ({ text, done: false })) : [{ text: name, done: false }]
    g.needsList = needsItems.length > 0 ? needsItems.map((text) => ({ text, done: false })) : []

    updated[goalIndex] = g
    setGoals(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-deep rounded-3xl p-6 max-w-md w-full flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-headline-md font-bold text-on-background">Editar Meta</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Nombre</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 px-4 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30" />
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
                  </button>
                )
              })}
            </div>
          </div>

          {goalType === "daily" && (
            <div className="flex flex-col gap-1.5">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Duración (días)</span>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 pl-10 pr-4 text-body-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">¿Qué hay que hacer?</span>
            <ItemListInput items={whatItems} onChange={setWhatItems} placeholder="Ej: Correr 3 veces por semana" />
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
            <ItemListInput items={needsItems} onChange={setNeedsItems} placeholder="Ej: Zapatos cómodos" />
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
                <input type="number" min={1} value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 pl-8 pr-4 text-body-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          )}
        </div>

        <Button variant="default" size="lg" className="w-full rounded-2xl" onClick={handleSave} disabled={!name.trim()}>
          <Save className="w-4 h-4" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}
