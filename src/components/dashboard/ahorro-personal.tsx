"use client"

import { useState } from "react"
import { PiggyBank, TrendingUp, Calendar, Plus, Pencil, X, Flame } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AhorroPersonal() {
  const [monthlyGoal, setMonthlyGoal] = useState(2000)
  const [saved, setSaved] = useState(850)
  const [savingStreak] = useState(3)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [goalInput, setGoalInput] = useState(String(monthlyGoal))
  const [addAmount, setAddAmount] = useState("")
  const [addNote, setAddNote] = useState("")

  const progress = Math.min((saved / monthlyGoal) * 100, 100)
  const remaining = monthlyGoal - saved

  const handleSaveGoal = () => {
    const val = parseInt(goalInput)
    if (val > 0) {
      setMonthlyGoal(val)
      setShowGoalModal(false)
    }
  }

  const handleAddMoney = () => {
    const val = parseInt(addAmount)
    if (val > 0) {
      setSaved((prev) => prev + val)
      setAddAmount("")
      setAddNote("")
      setShowAddModal(false)
    }
  }

  return (
    <>
      <div className="glass-card rounded-3xl p-6 flex flex-col gap-5 border-l-[3px] border-l-accent-julio relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="w-[280px] h-[280px] bg-accent-julio/8 rounded-full blur-[100px] absolute top-[-20%] right-[-10%]" />
          <div className="w-[200px] h-[200px] bg-primary-fixed-dim/8 rounded-full blur-[60px] absolute bottom-[-10%] left-[-5%]" />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent-julio/10 flex items-center justify-center flex-shrink-0">
              <PiggyBank className="w-5 h-5 text-accent-julio" />
            </div>
            <div>
              <h3 className="text-headline-md text-on-background font-bold">Ahorro Personal</h3>
              <p className="text-body-sm text-on-surface-variant">Meta mensual · ${monthlyGoal.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={() => { setGoalInput(String(monthlyGoal)); setShowGoalModal(true) }}
            className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-accent-julio transition-colors flex-shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-strong rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Ahorrado
              </span>
              <span className="text-headline-md font-bold text-accent-julio">${saved.toLocaleString()}</span>
            </div>
            <div className="glass-strong rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Restante
              </span>
              <span className="text-headline-md font-bold text-on-surface">${remaining.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Progreso Mensual</span>
              <span className="text-body-lg font-bold text-accent-julio">{Math.round(progress)}%</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3" />
              <div className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-accent-julio/30 to-accent-julio/10" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-body-sm text-on-surface-variant text-right">
              {progress >= 100
                ? "¡Meta alcanzada! Sigue ahorrando 🎉"
                : `Faltan $${remaining.toLocaleString()} para la meta`}
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent-julio" />
              <span className="text-body-sm text-on-surface-variant">Racha ahorro mensual</span>
            </div>
            <span className="text-body-sm font-bold text-accent-julio">🔥 {savingStreak} meses</span>
          </div>

          <Button
            variant="accent"
            size="lg"
            className="w-full rounded-2xl"
            onClick={() => { setAddAmount(""); setAddNote(""); setShowAddModal(true) }}
          >
            <Plus className="w-4 h-4" />
            Añadir Monto
          </Button>
        </div>
      </div>

      {showGoalModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={() => setShowGoalModal(false)} />
          <div className="relative glass-deep rounded-3xl p-6 max-w-sm w-full flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md font-bold text-on-background">Editar Meta</h3>
              <button onClick={() => setShowGoalModal(false)} className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Monto mensual</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-lg text-on-surface-variant font-semibold">$</span>
                <input
                  type="number"
                  min={1}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-full bg-white/60 border border-white/40 rounded-2xl py-3.5 pl-8 pr-4 text-body-lg font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-accent-julio/30"
                />
              </div>
            </div>
            <Button variant="default" size="lg" className="w-full rounded-2xl" onClick={handleSaveGoal}>
              Guardar Meta
            </Button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative glass-deep rounded-3xl p-6 max-w-sm w-full flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md font-bold text-on-background">Añadir Monto</h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Cantidad</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-lg text-on-surface-variant font-semibold">$</span>
                <input
                  type="number"
                  min={1}
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full bg-white/60 border border-white/40 rounded-2xl py-3.5 pl-8 pr-4 text-body-lg font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-accent-julio/30"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Nota (opcional)</span>
              <textarea
                value={addNote}
                onChange={(e) => setAddNote(e.target.value)}
                placeholder="¿Para qué fue este ahorro?"
                className="w-full bg-white/60 border border-white/40 rounded-2xl py-3 px-4 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-accent-julio/30 resize-none"
                rows={2}
              />
            </div>
            <Button variant="accent" size="lg" className="w-full rounded-2xl" onClick={handleAddMoney}>
              <Plus className="w-4 h-4" />
              Añadir
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
