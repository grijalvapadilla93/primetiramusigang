"use client"

import { useMemo, useState, useCallback } from "react"
import { History, X, CalendarDays, Dumbbell, Droplet, Pill, StretchVertical, Sparkles, Moon, SprayCan, ChevronLeft, ChevronRight, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterMode = "pablo" | "julio" | "ambos"

interface DayLog {
  date: number
  pablo: string[]
  julio: string[]
  pabloNotes: string[]
  julioNotes: string[]
}

const habitIcons: Record<string, React.ElementType> = {
  entrenamiento: Dumbbell,
  vitaminas: Pill,
  estiramiento: StretchVertical,
  "sin-azucar": Sparkles,
  sueno: Moon,
  skincare: SprayCan,
  agua: Droplet,
}

const habitLabels: Record<string, string> = {
  entrenamiento: "Entrenamiento",
  vitaminas: "Vitaminas",
  estiramiento: "Estiramiento",
  "sin-azucar": "Sin Azúcar",
  sueno: "Sueño",
  skincare: "Skincare",
  agua: "Agua",
}

const habitHexColors: Record<string, string> = {
  entrenamiento: "#0A84FF",
  vitaminas: "#34D399",
  estiramiento: "#2DD4BF",
  "sin-azucar": "#F472B6",
  sueno: "#A78BFA",
  skincare: "#FB7185",
  agua: "#22D3EE",
}

const allHabitIds = ["entrenamiento", "vitaminas", "estiramiento", "sin-azucar", "sueno", "skincare", "agua"]

function generateMonthLogs(year: number, month: number): DayLog[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const sampleNotes = ["Buen día 💪", "Me costó un poco", "Rutina ligera", "Completado ✅", "Día de descanso activo", "", "", "Mucha energía 🔥", "Con sueño pero lo hice", ""]
  const logs: DayLog[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const pablo = allHabitIds.filter(() => Math.random() > 0.3)
    const julio = allHabitIds.filter(() => Math.random() > 0.4)
    const pabloNotes = pablo.length > 0 ? [sampleNotes[Math.floor(Math.random() * sampleNotes.length)]] : []
    const julioNotes = julio.length > 0 ? [sampleNotes[Math.floor(Math.random() * sampleNotes.length)]] : []
    logs.push({ date: day, pablo, julio, pabloNotes, julioNotes })
  }
  return logs
}

function getCellInfo(pablo: string[], julio: string[], filter: FilterMode) {
  const total = allHabitIds.length
  const pabloPerfect = pablo.length === total
  const julioPerfect = julio.length === total

  const pabloRatio = pablo.length / total
  const julioRatio = julio.length / total

  return { pabloPerfect, julioPerfect, pabloRatio, julioRatio, pabloCount: pablo.length, julioCount: julio.length }
}

export function HistorySection() {
  const [filter, setFilter] = useState<FilterMode>("ambos")
  const [selectedDay, setSelectedDay] = useState<DayLog | null>(null)
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const logs = useMemo(() => generateMonthLogs(year, month), [year, month])
  const monthName = currentDate.toLocaleDateString("es-MX", { month: "long", year: "numeric" })
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  const totalPablo = logs.reduce((s, d) => s + d.pablo.length, 0)
  const totalJulio = logs.reduce((s, d) => s + d.julio.length, 0)
  const perfectDays = logs.filter((d) => d.pablo.length === allHabitIds.length && d.julio.length === allHabitIds.length).length

  const prevMonth = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }, [])

  const nextMonth = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }, [])

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-pablo to-accent-julio flex items-center justify-center">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-headline-lg font-bold text-on-background tracking-tight">Historial</h2>
            <p className="text-body-sm text-on-surface-variant capitalize">Tu progreso día a día</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(["pablo", "julio", "ambos"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={cn(
                "px-4 py-2 rounded-xl text-label-caps font-bold transition-all cursor-pointer",
                filter === mode
                  ? mode === "pablo"
                    ? "glass-strong bg-accent-pablo/15 text-accent-pablo ring-2 ring-accent-pablo/30"
                    : mode === "julio"
                      ? "glass-strong bg-accent-julio/15 text-accent-julio ring-2 ring-accent-julio/30"
                      : "glass-strong bg-primary/10 text-primary ring-2 ring-primary/30"
                  : "glass text-on-surface-variant hover:text-primary"
              )}
            >
              {mode === "pablo" ? "Pablo" : mode === "julio" ? "Julio" : "Ambos"}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3 text-label-caps text-on-surface-variant">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-accent-pablo" /> P: {totalPablo}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-accent-julio" /> J: {totalJulio}</span>
            {perfectDays > 0 && <span className="flex items-center gap-1 text-amber-400"><Crown className="w-4 h-4" /> {perfectDays}</span>}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-headline-sm font-bold text-on-background capitalize">{monthName}</span>
            <button onClick={nextMonth} className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <span key={d} className="text-label-caps text-on-surface-variant/60 text-center uppercase tracking-wider text-xs">{d}</span>
            ))}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {logs.map((day) => {
              const info = getCellInfo(day.pablo, day.julio, filter)
              const hasAny = day.pablo.length > 0 || day.julio.length > 0
              const bothPerfect = info.pabloPerfect && info.julioPerfect

              const cellBackground = (() => {
                if (bothPerfect) return "linear-gradient(135deg, #0A84FF 50%, #FF9F0A 50%)"
                if (filter === "pablo") {
                  const opacity = Math.max(0.15, info.pabloRatio * 0.8)
                  return `rgba(10, 132, 255, ${opacity})`
                }
                if (filter === "julio") {
                  const opacity = Math.max(0.15, info.julioRatio * 0.8)
                  return `rgba(255, 159, 10, ${opacity})`
                }
                const combined = day.pablo.length + day.julio.length
                if (info.pabloPerfect && !info.julioPerfect) return "rgba(10, 132, 255, 0.8)"
                if (info.julioPerfect && !info.pabloPerfect) return "rgba(255, 159, 10, 0.8)"
                if (combined === 0) return "rgba(255,255,255,0.06)"
                const pb = day.pablo.length / allHabitIds.length
                const jl = day.julio.length / allHabitIds.length
                return `linear-gradient(135deg, rgba(10, 132, 255, ${Math.max(0.15, pb)}), rgba(255, 159, 10, ${Math.max(0.15, jl)}))`
              })()

              const textBright = (() => {
                if (bothPerfect) return true
                if (filter === "pablo") return info.pabloRatio >= 0.4
                if (filter === "julio") return info.julioRatio >= 0.4
                if (info.pabloPerfect || info.julioPerfect) return true
                return (day.pablo.length + day.julio.length) / (allHabitIds.length * 2) >= 0.35
              })()

              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  style={{ background: cellBackground }}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center text-label-caps font-semibold transition-all cursor-pointer hover:scale-110 relative",
                    textBright ? "text-white" : "text-on-surface-variant/60",
                    !hasAny && "text-on-surface-variant/30"
                  )}
                >
                  <span>{day.date}</span>
                  {bothPerfect && (
                    <Crown className="w-4 h-4 text-amber-300 drop-shadow absolute -top-1 -right-1" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Resumen del mes</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-strong rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-pablo/15 flex items-center justify-center">
                <span className="text-accent-pablo font-bold text-sm">P</span>
              </div>
              <div>
                <p className="text-label-caps text-on-surface-variant">Pablo</p>
                <p className="text-body-md font-bold text-accent-pablo">{totalPablo} hábitos</p>
              </div>
            </div>
            <div className="glass-strong rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-julio/15 flex items-center justify-center">
                <span className="text-accent-julio font-bold text-sm">J</span>
              </div>
              <div>
                <p className="text-label-caps text-on-surface-variant">Julio</p>
                <p className="text-body-md font-bold text-accent-julio">{totalJulio} hábitos</p>
              </div>
            </div>
            <div className="glass-strong rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-label-caps text-on-surface-variant">Días perfectos</p>
                <p className="text-body-md font-bold text-accent-julio">{perfectDays} días</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-1">
            {allHabitIds.map((id) => (
              <div key={id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass text-label-caps text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: habitHexColors[id] }} />
                <span>{habitLabels[id]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Mejor día</span>
            {(() => {
              const best = [...logs].sort((a, b) => (b.pablo.length + b.julio.length) - (a.pablo.length + a.julio.length))[0]
              const total = best ? best.pablo.length + best.julio.length : 0
              return (
                <div>
                  <p className="text-headline-lg font-bold text-accent-pablo">Día {best?.date}</p>
                  <p className="text-body-sm text-on-surface-variant">{total} hábitos completados</p>
                </div>
              )
            })()}
          </div>
          <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Peor día</span>
            {(() => {
              const worst = [...logs].sort((a, b) => (a.pablo.length + a.julio.length) - (b.pablo.length + b.julio.length))[0]
              const total = worst ? worst.pablo.length + worst.julio.length : 0
              return (
                <div>
                  <p className="text-headline-lg font-bold text-accent-julio">Día {worst?.date}</p>
                  <p className="text-body-sm text-on-surface-variant">{total} hábitos completados</p>
                </div>
              )
            })()}
          </div>
          <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Más constante</span>
            {(() => {
              const counts = allHabitIds.map((id) => ({ id, count: logs.filter((d) => d.pablo.includes(id) || d.julio.includes(id)).length }))
              const top = counts.sort((a, b) => b.count - a.count)[0]
              const Icon = habitIcons[top.id]
              return (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${habitHexColors[top.id]}20` }}>
                    {Icon && <Icon className="w-4 h-4" style={{ color: habitHexColors[top.id] }} />}
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-on-surface">{habitLabels[top.id]}</p>
                    <p className="text-label-caps text-on-surface-variant">{top.count} días</p>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
          <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Tendencia semanal</span>
          <div className="flex items-end gap-2 h-24">
            {(() => {
              const weeks: number[] = []
              for (let w = 0; w < 4; w++) {
                const start = w * 7
                const end = Math.min(start + 7, logs.length)
                let total = 0
                for (let d = start; d < end; d++) {
                  total += logs[d]?.pablo.length || 0
                  total += logs[d]?.julio.length || 0
                }
                weeks.push(total)
              }
              const max = Math.max(...weeks, 1)
              return weeks.map((w, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-xl bg-gradient-to-t from-accent-pablo to-accent-julio transition-all" style={{ height: `${(w / max) * 100}%` }} />
                  <span className="text-label-caps text-on-surface-variant">Sem {i + 1}</span>
                </div>
              ))
            })()}
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-strong text-primary hover:bg-primary/5 transition-all text-body-sm font-semibold cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Exportar mes
        </button>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={() => setSelectedDay(null)} />
          <div className="relative glass-deep rounded-3xl p-6 max-w-md w-full flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-headline-md font-bold text-on-background">
                    {selectedDay.date} de {monthName.split(" de")[0]}
                  </h3>
                  {getCellInfo(selectedDay.pablo, selectedDay.julio, "ambos").pabloPerfect && getCellInfo(selectedDay.pablo, selectedDay.julio, "ambos").julioPerfect && (
                    <div className="flex items-center gap-1 text-label-caps text-amber-400">
                      <Crown className="w-4 h-4" /> Día perfecto
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedDay(null)} className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center text-on-surface-variant hover:text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-accent-pablo" />
                  <span className="text-label-caps text-accent-pablo font-bold uppercase">Pablo</span>
                  <span className="text-label-caps text-on-surface-variant">{selectedDay.pablo.length}/{allHabitIds.length} hábitos</span>
                </div>
                {selectedDay.pablo.length === 0 ? (
                  <p className="text-body-sm text-on-surface-variant/60 italic">Nada registrado</p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-1.5">
                      {allHabitIds.map((id) => {
                        const done = selectedDay.pablo.includes(id)
                        const Icon = habitIcons[id]
                        return (
                          <div key={id} className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-label-caps", done ? "glass-strong" : "glass opacity-40")}>
                            {Icon && <Icon className={cn("w-3 h-3", done ? "" : "text-on-surface-variant")} />}
                            <span className={done ? "" : "text-on-surface-variant"}>{habitLabels[id]}</span>
                          </div>
                        )
                      })}
                    </div>
                    {selectedDay.pabloNotes.length > 0 && selectedDay.pabloNotes[0] && (
                      <div className="glass rounded-xl px-3 py-2">
                        <span className="text-label-caps text-on-surface-variant">📝 {selectedDay.pabloNotes[0]}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-accent-julio" />
                  <span className="text-label-caps text-accent-julio font-bold uppercase">Julio</span>
                  <span className="text-label-caps text-on-surface-variant">{selectedDay.julio.length}/{allHabitIds.length} hábitos</span>
                </div>
                {selectedDay.julio.length === 0 ? (
                  <p className="text-body-sm text-on-surface-variant/60 italic">Nada registrado</p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-1.5">
                      {allHabitIds.map((id) => {
                        const done = selectedDay.julio.includes(id)
                        const Icon = habitIcons[id]
                        return (
                          <div key={id} className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-label-caps", done ? "glass-strong" : "glass opacity-40")}>
                            {Icon && <Icon className={cn("w-3 h-3", done ? "" : "text-on-surface-variant")} />}
                            <span className={done ? "" : "text-on-surface-variant"}>{habitLabels[id]}</span>
                          </div>
                        )
                      })}
                    </div>
                    {selectedDay.julioNotes.length > 0 && selectedDay.julioNotes[0] && (
                      <div className="glass rounded-xl px-3 py-2">
                        <span className="text-label-caps text-on-surface-variant">📝 {selectedDay.julioNotes[0]}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
