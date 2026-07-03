"use client"

import { useState } from "react"
import { X, TrendingUp, Clock, Circle, CheckCircle, DollarSign, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboard, type Goal } from "@/lib/dashboard-context"
import { cn } from "@/lib/utils"

interface ProgressModalProps {
  goal: Goal
  goalIndex: number
  onClose: () => void
}

export function ProgressModal({ goal, goalIndex, onClose }: ProgressModalProps) {
  const { goals, setGoals } = useDashboard()
  const [description, setDescription] = useState("")
  const [amountInput, setAmountInput] = useState("")

  const toggleChecklist = (idx: number) => {
    const updated = [...goals]
    const g = { ...updated[goalIndex] }
    const items = [...g.checklist]
    items[idx] = { ...items[idx], done: !items[idx].done }
    g.checklist = items
    updated[goalIndex] = g
    setGoals(updated)
  }

  const toggleNeeds = (idx: number) => {
    const updated = [...goals]
    const g = { ...updated[goalIndex] }
    const items = [...g.needsList]
    items[idx] = { ...items[idx], done: !items[idx].done }
    g.needsList = items
    updated[goalIndex] = g
    setGoals(updated)
  }

  const addDailyProgress = () => {
    const updated = [...goals]
    const g = { ...updated[goalIndex] }
    const newDays = Math.min(g.progress + 1, g.durationDays || 1)
    g.progress = newDays
    g.target = `Día ${newDays} / ${g.durationDays}`
    g.entries = [...g.entries, { date: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short" }), description: description.trim() || "Completado" }]
    updated[goalIndex] = g
    setGoals(updated)
    setDescription("")
    onClose()
  }

  const addProjectProgress = () => {
    if (!description.trim()) return
    const updated = [...goals]
    const g = { ...updated[goalIndex] }
    const newProgress = Math.min(g.progress + 10, 100)
    g.progress = newProgress
    g.target = `${newProgress}% completado`
    g.entries = [...g.entries, { date: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short" }), description: description.trim() }]
    updated[goalIndex] = g
    setGoals(updated)
    setDescription("")
    onClose()
  }

  const addMoney = () => {
    const amt = parseInt(amountInput) || 0
    if (amt <= 0) return
    const updated = [...goals]
    const g = { ...updated[goalIndex] }
    const saved = (g.progress || 0) + amt
    g.progress = g.goalType === "daily" ? g.progress : saved
    g.target = `$${saved.toLocaleString()} / $${(g.targetAmount || 0).toLocaleString()}`
    g.entries = [...g.entries, { date: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short" }), description: description.trim() || "Ahorro", amount: amt }]
    updated[goalIndex] = g
    setGoals(updated)
    setAmountInput("")
    setDescription("")
    onClose()
  }

  const isDailyComplete = goal.goalType === "daily" && goal.durationDays ? goal.progress >= goal.durationDays : false
  const isProjectComplete = goal.goalType === "project" && goal.progress >= 100
  const isComplete = isDailyComplete || isProjectComplete

  const today = new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-deep rounded-3xl p-6 max-w-md w-full flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-headline-md font-bold text-on-background">Progresar</h3>
              <p className="text-body-sm text-on-surface-variant">{goal.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isComplete && (
          <div className="glass-strong rounded-2xl p-3 bg-accent-julio/10 text-center">
            <p className="text-body-sm font-bold text-accent-julio">¡Meta completada! 🎉</p>
          </div>
        )}

        {goal.goalType === "daily" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Días</span>
              <span className="text-body-sm font-bold text-primary">{goal.progress} / {goal.durationDays}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/30 overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-500", goal.color)} style={{ width: `${goal.durationDays ? (goal.progress / goal.durationDays) * 100 : 0}%` }} />
            </div>
          </div>
        )}

        {goal.goalType === "project" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Progreso</span>
              <span className="text-body-sm font-bold text-primary">{goal.progress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/30 overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-500", goal.color)} style={{ width: `${goal.progress}%` }} />
            </div>
          </div>
        )}

        {goal.needsMoney && goal.progress > 0 && (
          <div className="flex items-center justify-between glass-strong rounded-xl px-3 py-2">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Ahorrado</span>
            <span className="text-body-sm font-bold text-accent-julio">
              ${goal.progress.toLocaleString()} / ${(goal.targetAmount || 0).toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <Clock className="w-4 h-4" />
          <span className="capitalize">{today}</span>
        </div>

        {goal.checklist.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Qué</span>
            <div className="flex flex-wrap gap-2">
              {goal.checklist.map((item, i) => (
                <button key={i} onClick={() => toggleChecklist(i)} className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                  {item.done ? <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> : <Circle className="w-4 h-4 flex-shrink-0" />}
                  <span className={`text-body-sm ${item.done ? "line-through opacity-60" : ""}`}>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {goal.needsList.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Necesita</span>
            <div className="flex flex-wrap gap-2">
              {goal.needsList.map((item, i) => (
                <button key={i} onClick={() => toggleNeeds(i)} className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-on-surface-variant hover:text-accent-julio transition-all cursor-pointer">
                  {item.done ? <CheckCircle className="w-4 h-4 text-accent-julio flex-shrink-0" /> : <Circle className="w-4 h-4 flex-shrink-0" />}
                  <span className={`text-body-sm ${item.done ? "line-through opacity-60" : ""}`}>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {goal.goalType === "daily" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Nota (opcional)</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="¿Cómo te fue hoy?" className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 px-4 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" rows={2} />
            </div>
            <Button variant="default" size="lg" className="w-full rounded-2xl" onClick={addDailyProgress} disabled={isDailyComplete}>
              <Repeat className="w-4 h-4" />
              Completar Hoy — Día {goal.progress + 1}
            </Button>
          </div>
        )}

        {goal.goalType === "project" && !goal.needsMoney && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">¿Qué hiciste?</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Leí 3 capítulos y tomé notas..." className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 px-4 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" rows={3} autoFocus />
            </div>
            <Button variant="default" size="lg" className="w-full rounded-2xl" onClick={addProjectProgress} disabled={!description.trim() || isProjectComplete}>
              <TrendingUp className="w-4 h-4" />
              +10% Progreso
            </Button>
          </div>
        )}

        {goal.needsMoney && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">¿Cuánto ahorraste?</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-sm text-on-surface-variant font-semibold">$</span>
                <input type="number" min={1} value={amountInput} onChange={(e) => setAmountInput(e.target.value)} placeholder="0" className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 pl-8 pr-4 text-body-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30" autoFocus />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Nota (opcional)</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Venta de la bicicleta" className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 px-4 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" rows={2} />
            </div>
            <Button variant="default" size="lg" className="w-full rounded-2xl" onClick={addMoney} disabled={!amountInput || parseInt(amountInput) <= 0}>
              <DollarSign className="w-4 h-4" />
              Añadir ${parseInt(amountInput) || 0}
            </Button>
          </div>
        )}

        {goal.entries.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Historial</span>
            <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
              {goal.entries.slice(-5).reverse().map((e, i) => (
                <div key={i} className="glass rounded-xl px-3 py-2 flex items-start gap-2">
                  <span className="text-label-caps text-on-surface-variant flex-shrink-0 mt-0.5">{e.date}</span>
                  <p className="text-body-sm text-on-surface flex-1">{e.description}</p>
                  {e.amount && <span className="text-label-caps font-bold text-accent-julio flex-shrink-0">+${e.amount}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
