"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface CelebrationModalProps {
  habitName: string
  isOpen: boolean
  onClose: () => void
}

export function CelebrationModal({
  habitName,
  isOpen,
  onClose,
}: CelebrationModalProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true))
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300)
      }, 2500)
      return () => clearTimeout(timer)
    }
    setVisible(false)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500",
        visible
          ? "bg-black/15 backdrop-blur-sm"
          : "bg-transparent backdrop-blur-none pointer-events-none"
      )}
    >
      <div
        className={cn(
          "relative flex flex-col items-center gap-3 px-10 py-8 rounded-3xl transition-all duration-500",
          "bg-white/70 backdrop-blur-[24px] border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.08)]",
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-50 translate-y-10"
        )}
        style={{
          animation: visible ? "celebration-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" : "none",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-accent-pablo/30"
              style={{
                left: `${15 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
                animation: `sparkle ${1.5 + i * 0.3}s ease-in-out ${i * 0.15}s infinite`,
              }}
            >
              <Star className="w-4 h-4 fill-current" />
            </div>
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`float-${i}`}
              className="absolute text-accent-julio/20"
              style={{
                left: `${25 + i * 18}%`,
                bottom: "10%",
                animation: `float-up ${2 + i * 0.4}s ease-out ${i * 0.2}s infinite`,
              }}
            >
              <Star className="w-3 h-3 fill-current" />
            </div>
          ))}
        </div>

        <div
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
          style={{
            animation: visible ? "celebration-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both" : "none",
          }}
        >
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        <p
          className="text-headline-lg font-bold text-on-surface text-center"
          style={{
            animation: visible ? "celebration-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both" : "none",
          }}
        >
          ¡Buen trabajo!
        </p>

        <p
          className="text-body-lg text-on-surface-variant text-center"
          style={{
            animation: visible ? "celebration-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s both" : "none",
          }}
        >
          {habitName} completado
        </p>
      </div>
    </div>
  )
}
