"use client"

import { Crown, Flame, Sparkles } from "lucide-react"

const messages = [
  "Cada día cuenta, ¡sigue así! 🔥",
  "El hábito hace al maestro 💪",
  "Hoy es una nueva oportunidad 🌅",
  "Pequeños pasos, grandes resultados 📈",
  "Tú puedes, ¡ya lo estás logrando! ⭐",
  "La consistencia vence al talento 🏆",
  "Un día a la vez, sin rendirse 🚀",
]

export function MotivationalMessage({
  primeStreak,
  pabloStreak,
  julioStreak,
}: {
  primeStreak: number
  pabloStreak: number
  julioStreak: number
}) {
  const msg = messages[primeStreak % messages.length]
  const bestStreak = Math.max(primeStreak, pabloStreak, julioStreak)

  return (
    <div className="glass-card rounded-3xl p-5 flex items-center gap-4 border-l-[3px] border-l-amber-400">
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-accent-julio flex items-center justify-center flex-shrink-0">
        {bestStreak >= 7 ? <Crown className="w-5 h-5 text-white" /> : bestStreak >= 3 ? <Flame className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body-md font-bold text-on-background">{msg}</p>
        <p className="text-label-caps text-on-surface-variant">
          {primeStreak} días de racha Prime · Pablo {pabloStreak} · Julio {julioStreak}
        </p>
      </div>
    </div>
  )
}
