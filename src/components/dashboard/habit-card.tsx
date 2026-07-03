"use client"

import { useEffect, useState } from "react"
import {
  Flame,
  CheckCircle,
  Circle,
  XCircle,
  Dumbbell,
  Droplet,
  Pill,
  Plus,
  Minus,
  StretchHorizontal,
  Sparkles,
  Moon,
  SprayCan,
  Undo2,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { HabitInteraction } from "@/lib/habit-categories"

const iconMap: Record<string, React.ElementType> = {
  dumbbell: Dumbbell,
  droplet: Droplet,
  pill: Pill,
  stretch: StretchHorizontal,
  sparkles: Sparkles,
  moon: Moon,
  spray: SprayCan,
}

interface UserStatus {
  name: string
  accent: "pablo" | "julio"
  done: boolean
  note?: string
}

type CardStatus = "pending" | "completed" | "skipped"

interface WildcardConfig {
  label: string
  resultMessage: string
}

interface HabitCardProps {
  habitId: string
  name: string
  icon: string
  streak: number
  totalDays: number
  accent: "pablo" | "julio"
  cardStatus: CardStatus
  interaction: HabitInteraction
  userStatus: UserStatus
  partnerStatus: UserStatus
  wildcard?: WildcardConfig
  progress?: { current: number; total: number }
  fullWidth?: boolean
  onCheckin?: (habitId: string) => void
  onWaterAdd?: (habitId: string) => void
  onWaterRemove?: (habitId: string) => void
  onToggle?: (habitId: string) => void
  onSkip?: (habitId: string) => void
  onUndo?: (habitId: string) => void
}

function GlassIcon({
  filled,
  accent,
}: {
  filled: boolean
  accent: "pablo" | "julio"
}) {
  const color = accent === "pablo" ? "text-accent-pablo" : "text-accent-julio"

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-end transition-all duration-500",
        filled ? "opacity-100 scale-100" : "opacity-40 scale-95"
      )}
    >
      <svg
        viewBox="0 0 20 28"
        className={cn(
          "w-6 h-8 sm:w-7 sm:h-9 transition-all duration-500",
          filled ? color : "text-outline-variant"
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d={filled
            ? "M3 2h14l-1.2 18a2 2 0 0 1-2 1.8H6.2a2 2 0 0 1-2-1.8L3 2z M4.5 10h11L15 20a1.5 1.5 0 0 1-1.5 1.2H6.5A1.5 1.5 0 0 1 5 20z"
            : "M3 2h14l-1.2 18a2 2 0 0 1-2 1.8H6.2a2 2 0 0 1-2-1.8L3 2z"}
        />
      </svg>
    </div>
  )
}

export function HabitCard({
  habitId,
  name,
  icon,
  streak,
  totalDays,
  accent,
  cardStatus,
  interaction,
  userStatus,
  partnerStatus,
  wildcard,
  progress,
  fullWidth,
  onCheckin,
  onWaterAdd,
  onWaterRemove,
  onToggle,
  onSkip,
  onUndo,
}: HabitCardProps) {
  const Icon = iconMap[icon] || Dumbbell
  const isPablo = accent === "pablo"
  const glasses = progress?.current ?? 0
  const totalGlasses = progress?.total ?? 8
  const [wildcardActive, setWildcardActive] = useState(false)

  useEffect(() => {
    if (wildcardActive) {
      const timer = setTimeout(() => onToggle?.(habitId), 2500)
      return () => clearTimeout(timer)
    }
  }, [wildcardActive, habitId, onToggle])

  useEffect(() => {
    if (cardStatus !== "pending") {
      setWildcardActive(false)
    }
  }, [cardStatus])

  const leftAccentBorder = isPablo ? "border-l-accent-pablo" : "border-l-accent-julio"

  return (
    <div
      className={cn(
        "glass-card rounded-3xl p-6 flex flex-col gap-5 transition-all duration-300",
        cardStatus === "completed" && "border-l-[3px]",
        cardStatus === "completed" && leftAccentBorder,
        cardStatus === "skipped" && "border-l-[3px] border-l-outline-variant",
        cardStatus === "pending" && "hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-body-lg font-bold text-on-background">{name}</h3>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
              <span className="text-body-sm text-on-surface-variant">
                {totalDays} días totales
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame
                className={cn(
                  "w-3.5 h-3.5",
                  streak > 0 && isPablo && "text-accent-pablo",
                  streak > 0 && !isPablo && "text-accent-julio",
                  streak === 0 && "text-on-surface-variant"
                )}
              />
              <span
                className={cn(
                  "text-body-sm",
                  streak > 0 && isPablo && "text-accent-pablo",
                  streak > 0 && !isPablo && "text-accent-julio",
                  streak === 0 && "text-on-surface-variant"
                )}
              >
                Racha {streak} días
              </span>
            </div>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-outline-variant" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {cardStatus === "completed" && (
          <div
            className={cn(
              "glass-strong rounded-2xl p-4 flex items-center justify-between",
              isPablo
                ? "bg-accent-pablo/8 border-accent-pablo/20"
                : "bg-accent-julio/8 border-accent-julio/20"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm",
                  isPablo ? "bg-accent-pablo" : "bg-accent-julio"
                )}
              >
                {userStatus.name[0]}
              </div>
              <div>
                <span className="text-body-sm font-semibold">Tú</span>
                <p className="text-label-caps text-on-surface-variant">Completado hoy</p>
              </div>
            </div>
            <CheckCircle
              className={cn(
                "w-6 h-6",
                isPablo ? "text-accent-pablo" : "text-accent-julio"
              )}
            />
          </div>
        )}

        {cardStatus === "skipped" && (
          <div className="glass-strong rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-on-surface-variant" />
              <div>
                <span className="text-body-sm font-semibold text-on-surface-variant">
                  No lo hice hoy
                </span>
                <p className="text-label-caps text-on-surface-variant/60">Omitido</p>
              </div>
            </div>
          </div>
        )}

        {cardStatus === "pending" && interaction === "counter" && (
          <div className="glass-strong rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                Progreso Diario
              </span>
              <span className="text-headline-md text-primary">
                {glasses}/{totalGlasses}
                <span className="text-body-sm font-normal text-on-surface-variant ml-1">vasos</span>
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => onWaterRemove?.(habitId)}
                disabled={glasses === 0}
                className="flex-shrink-0 w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:bg-white/80 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4 text-on-surface-variant" />
              </button>

              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {Array.from({ length: totalGlasses }, (_, i) => (
                  <GlassIcon key={i} filled={i < glasses} accent={accent} />
                ))}
              </div>

              <button
                type="button"
                onClick={() => onWaterAdd?.(habitId)}
                disabled={glasses >= totalGlasses}
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm",
                  glasses < totalGlasses
                    ? "bg-primary text-white hover:opacity-90"
                    : "glass-strong"
                )}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {cardStatus === "pending" && interaction === "toggle" && !wildcardActive && (
          <div className="flex flex-col gap-2.5">
            <Button
              variant={isPablo ? "default" : "secondary"}
              size="lg"
              className={cn(
                "w-full rounded-2xl",
                isPablo
                  ? "bg-accent-pablo text-white hover:opacity-90"
                  : "bg-accent-julio text-white hover:brightness-110"
              )}
              onClick={() => onToggle?.(habitId)}
            >
              Completar Día
            </Button>
            {wildcard && (
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl border-accent-julio/30 text-accent-julio hover:bg-accent-julio/8"
                onClick={() => setWildcardActive(true)}
              >
                {wildcard.label}
              </Button>
            )}
          </div>
        )}

        {cardStatus === "pending" && interaction === "toggle" && wildcardActive && (
          <div className="glass-strong rounded-2xl p-5 flex flex-col items-center justify-center gap-2 border-accent-julio/20">
            <p className="text-body-lg font-semibold text-accent-julio text-center">
              {wildcard?.resultMessage}
            </p>
            <p className="text-body-sm text-on-surface-variant text-center">
              No te va a cortar la racha y te va a contar como un día más sin azúcar
            </p>
          </div>
        )}

        {cardStatus === "pending" && interaction === "modal" && (
          <Button
            variant={isPablo ? "default" : "secondary"}
            size="lg"
            className={cn(
              "w-full rounded-2xl",
              isPablo
                ? "bg-accent-pablo text-white hover:opacity-90"
                : "bg-accent-julio text-white hover:brightness-110"
            )}
            onClick={() => onCheckin?.(habitId)}
          >
            Completar Día
          </Button>
        )}

        {(cardStatus === "completed" || cardStatus === "skipped") && (
          <button
            onClick={() => onUndo?.(habitId)}
            className="flex items-center justify-center gap-1.5 text-body-sm text-on-surface-variant hover:text-primary transition-colors py-1.5"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Deshacer
          </button>
        )}

        {cardStatus === "pending" && !wildcardActive && (
          <button
            onClick={() => onSkip?.(habitId)}
            className="flex items-center justify-center gap-1.5 text-body-sm text-on-surface-variant/50 hover:text-on-surface-variant transition-colors py-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            No lo hice hoy
          </button>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/30">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm",
                partnerStatus.accent === "julio"
                  ? "bg-accent-julio"
                  : "bg-accent-pablo"
              )}
            >
              {partnerStatus.name[0]}
            </div>
            <span className="text-body-sm text-on-surface-variant">
              {partnerStatus.name}
            </span>
          </div>
          {partnerStatus.done ? (
            <div className="flex items-center gap-1.5">
              <span className="text-label-caps text-on-surface-variant">Completado</span>
              <CheckCircle
                className={cn(
                  "w-4 h-4",
                  partnerStatus.accent === "pablo"
                    ? "text-accent-pablo"
                    : "text-accent-julio"
                )}
              />
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-label-caps text-on-surface-variant/50">Pendiente</span>
              <Circle className="w-4 h-4 text-outline-variant" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
