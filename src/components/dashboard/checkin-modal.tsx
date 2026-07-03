"use client"

import { useState } from "react"
import { X, Check, Moon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import type { HabitMeta } from "@/lib/habit-categories"

interface CategoryEntry {
  id: string
  duration: number
}

interface CheckinModalProps {
  habit: HabitMeta
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    categories?: CategoryEntry[]
    note: string
    value?: number
    rating?: number
    sleepHours?: number
  }) => void
  accent: "pablo" | "julio"
}

export function CheckinModal({
  habit,
  isOpen,
  onClose,
  onSave,
  accent,
}: CheckinModalProps) {
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [note, setNote] = useState("")
  const [rating, setRating] = useState(0)
  const [sleepHours, setSleepHours] = useState(7.5)

  if (!isOpen) return null

  const isSueno = habit.id === "sueno"
  const isMulti = habit.multiSelect
  const hasCategories = habit.categories.length > 0
  const isComplete = hasCategories ? Object.keys(selected).length > 0 : true

  const toggleCategory = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev }
      if (id in next) {
        delete next[id]
      } else if (isMulti) {
        next[id] = 30
      } else {
        return { [id]: 30 }
      }
      return next
    })
  }

  const setDuration = (id: string, minutes: number) => {
    setSelected((prev) => ({ ...prev, [id]: Math.max(0, minutes) }))
  }

  const handleSave = () => {
    const entries = Object.entries(selected).map(([id, duration]) => ({
      id,
      duration,
    }))
    onSave({
      categories: entries.length > 0 ? entries : undefined,
      note,
      rating: rating || undefined,
      sleepHours: isSueno ? sleepHours : undefined,
    })
    setSelected({})
    setNote("")
    setRating(0)
    setSleepHours(7.5)
    onClose()
  }

  const totalMinutes = Object.values(selected).reduce((a, b) => a + b, 0)
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  const accentBg =
    accent === "pablo" ? "bg-accent-pablo/10" : "bg-accent-julio/10"
  const accentText = accent === "pablo" ? "text-accent-pablo" : "text-accent-julio"
  const accentRing = accent === "pablo" ? "ring-accent-pablo" : "ring-accent-julio"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-container-margin">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md bg-surface/60 backdrop-blur-[20px] rounded-[32px] border border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="w-[800px] h-[800px] bg-primary-fixed-dim/20 rounded-full blur-[100px] absolute top-[-20%] right-[-10%] mix-blend-multiply" />
          <div className="w-[600px] h-[600px] bg-secondary-fixed/30 rounded-full blur-[80px] absolute bottom-[-10%] left-[-10%] mix-blend-multiply" />
        </div>

        <div className="relative z-10 p-glass-padding pb-stack-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accentBg)}>
              <Moon className={cn("w-4 h-4", accentText)} />
            </div>
            <h2 className="text-headline-md text-on-surface">{habit.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container/50 text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-glass-padding pb-glass-padding space-y-stack-lg">
          {isSueno && (
            <section className="space-y-stack-md">
              <div className="flex items-center gap-2 text-primary">
                <Moon className="w-5 h-5" />
                <h3 className="text-label-caps uppercase tracking-widest text-on-surface-variant">
                  Horas de Sueño
                </h3>
              </div>
              <div className="bg-surface/50 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col items-center justify-center">
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    min={0}
                    max={24}
                    step={0.5}
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-transparent border-b-2 border-surface-variant text-center text-display-progress text-headline-lg text-on-surface focus:outline-none focus:border-primary transition-colors pb-1"
                  />
                  <span className="text-body-lg text-on-surface-variant">hrs</span>
                </div>
              </div>
            </section>
          )}

          {hasCategories && (
            <section className="space-y-stack-md">
              <span className="text-label-caps uppercase tracking-widest text-on-surface-variant block">
                {isMulti ? "¿Qué hiciste? (selecciona todos los que aplican)" : "¿Qué hiciste?"}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {habit.categories.map((cat) => {
                  const isSelected = cat.id in selected
                  return (
                    <div
                      key={cat.id}
                      className={cn(
                        "rounded-xl border transition-all",
                        isSelected
                          ? cn("border-primary/30 bg-primary/10 ring-2", accentRing)
                          : "border-white/30 bg-white/40"
                      )}
                    >
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="flex items-center justify-between w-full p-4"
                      >
                        <span className="text-body-sm font-semibold text-on-surface">
                          {cat.label}
                        </span>
                        <span
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-primary border-primary text-on-primary"
                              : "border-outline-variant bg-white/60"
                          )}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </span>
                      </button>
                      {isSelected && isMulti && cat.id !== "poco-ejercicio" && (
                        <div className="px-4 pb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-on-surface-variant" />
                          <input
                            type="number"
                            min={0}
                            max={600}
                            value={selected[cat.id]}
                            onChange={(e) =>
                              setDuration(cat.id, parseInt(e.target.value) || 0)
                            }
                            className="w-20 bg-white/60 border border-white/40 rounded-lg px-3 py-1.5 text-body-sm text-on-surface text-center focus:outline-none focus:ring-2 focus:ring-accent-pablo"
                          />
                          <span className="text-body-sm text-on-surface-variant">
                            min
                          </span>
                        </div>
                      )}
                      {isSelected && cat.id === "poco-ejercicio" && (
                        <div className="px-4 pb-4">
                          <p className="text-body-sm text-on-surface-variant italic">
                            Un poco para no perder la racha 💪
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {isMulti && totalMinutes > 0 && (
                <p className="text-body-sm text-on-surface-variant text-right">
                  Total: {hours > 0 ? `${hours}h ` : ""}
                  {mins}min
                </p>
              )}
            </section>
          )}

          <section className="space-y-stack-sm">
            <h3 className="text-label-caps uppercase tracking-widest text-on-surface-variant ml-1">
              Calificación
            </h3>
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all active:scale-90",
                    rating >= n
                      ? accent === "pablo"
                        ? "bg-accent-pablo text-white"
                        : "bg-accent-julio text-white"
                      : "bg-white/40 text-on-surface-variant border border-white/30 hover:bg-white/60"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-stack-sm">
            <h3 className="text-label-caps uppercase tracking-widest text-on-surface-variant ml-1">
              Notas (Opcional)
            </h3>
            <Textarea
              className="w-full bg-surface-container-lowest/40 backdrop-blur-sm border border-white/40 rounded-xl p-4 resize-none"
              placeholder="¿Cómo te sientes hoy?"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </section>
        </div>

        <div className="relative z-10 p-glass-padding pt-stack-sm bg-surface/40 backdrop-blur-md border-t border-white/20">
          <button
            onClick={handleSave}
            disabled={!isComplete}
            className={cn(
              "w-full py-4 rounded-full flex items-center justify-center gap-2 text-body-lg shadow-[0_4px_12px_rgba(0,90,179,0.08)] transition-all duration-300 active:scale-[0.98]",
              isComplete
                ? "bg-primary text-on-primary hover:opacity-90"
                : "bg-primary/10 border border-primary/20 text-primary/50 cursor-not-allowed"
            )}
          >
            <span>Completar Día</span>
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
