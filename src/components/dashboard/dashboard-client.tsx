"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { DashboardProvider, useDashboard } from "@/lib/dashboard-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StreakPanel } from "@/components/dashboard/streak-panel"
import { HabitCard } from "@/components/dashboard/habit-card"
import { GoalsPreview } from "@/components/dashboard/goals-preview"
import { MetasSection } from "@/components/dashboard/metas-section"
import { AhorroPersonal } from "@/components/dashboard/ahorro-personal"
import { FAB } from "@/components/dashboard/fab"
import { NewGoalModal } from "@/components/dashboard/goal-modal"
import { CheckinModal } from "@/components/dashboard/checkin-modal"
import { CelebrationModal } from "@/components/dashboard/celebration-modal"
import { getHabitMeta, type HabitMeta, type HabitInteraction } from "@/lib/habit-categories"
import { HistorySection } from "@/components/dashboard/history-section"
import { MotivationalMessage } from "@/components/dashboard/motivational-message"
import { RecentFeed } from "@/components/dashboard/recent-feed"
import { WeekComparison } from "@/components/dashboard/week-comparison"

interface WaterProgress {
  [habitId: string]: number
}

type CardStatus = "pending" | "completed" | "skipped"

interface HabitData {
  id: string
  name: string
  icon: string
  streak: number
  totalDays: number
  accent: "pablo" | "julio"
  interaction: HabitInteraction
  partnerDone: boolean
}

const allHabits: HabitData[] = [
  { id: "entrenamiento", name: "Entrenamiento", icon: "dumbbell", streak: 12, totalDays: 67, accent: "pablo", interaction: "modal", partnerDone: true },
  { id: "vitaminas", name: "Vitaminas", icon: "pill", streak: 21, totalDays: 89, accent: "pablo", interaction: "toggle", partnerDone: true },
  { id: "estiramiento", name: "Estiramiento", icon: "stretch", streak: 3, totalDays: 14, accent: "pablo", interaction: "toggle", partnerDone: false },
  { id: "sin-azucar", name: "Sin Azúcar", icon: "sparkles", streak: 5, totalDays: 23, accent: "pablo", interaction: "toggle", partnerDone: false },
  { id: "sueno", name: "Sueño (anoche)", icon: "moon", streak: 6, totalDays: 45, accent: "pablo", interaction: "modal", partnerDone: true },
  { id: "skincare", name: "Skincare", icon: "spray", streak: 2, totalDays: 8, accent: "pablo", interaction: "toggle", partnerDone: false },
  { id: "agua", name: "Agua (2L)", icon: "droplet", streak: 4, totalDays: 31, accent: "pablo", interaction: "counter", partnerDone: false },
]

const habitNameMap: Record<string, string> = Object.fromEntries(
  allHabits.map((h) => [h.id, h.name])
)

function DashboardContent() {
  const { activeSection } = useDashboard()
  const [checkinHabit, setCheckinHabit] = useState<HabitMeta | null>(null)
  const [waterProgress, setWaterProgress] = useState<WaterProgress>({})
  const [habitStatus, setHabitStatus] = useState<Record<string, CardStatus>>({})
  const [, setHabitNotes] = useState<Record<string, string>>({})
  const [completedHabitName, setCompletedHabitName] = useState<string | null>(null)

  const getStatus = useCallback(
    (id: string): CardStatus => habitStatus[id] || "pending",
    [habitStatus]
  )

  const triggerCelebration = useCallback((habitId: string) => {
    setCompletedHabitName(habitNameMap[habitId] || null)
  }, [])

  const handleCheckin = useCallback((habitId: string) => {
    const meta = getHabitMeta(habitId)
    if (meta) setCheckinHabit(meta)
  }, [])

  const handleToggle = useCallback((habitId: string) => {
    setHabitStatus((prev) => {
      if (prev[habitId] === "completed") {
        const next = { ...prev }
        delete next[habitId]
        return next
      }
      return { ...prev, [habitId]: "completed" }
    })
    triggerCelebration(habitId)
  }, [triggerCelebration])

  const handleWaterAdd = useCallback((habitId: string) => {
    if (habitId !== "agua") return
    setWaterProgress((prev) => {
      const current = prev[habitId] || 0
      const next = Math.min(current + 1, 8)
      if (next >= 8) {
        setHabitStatus((s) => ({ ...s, [habitId]: "completed" }))
        triggerCelebration(habitId)
      }
      return { ...prev, [habitId]: next }
    })
  }, [triggerCelebration])

  const handleWaterRemove = useCallback((habitId: string) => {
    if (habitId !== "agua") return
    setWaterProgress((prev) => {
      const current = prev[habitId] || 0
      const next = Math.max(current - 1, 0)
      if (current >= 8) {
        setHabitStatus((s) => {
          const nextStatus = { ...s }
          delete nextStatus[habitId]
          return nextStatus
        })
      }
      return { ...prev, [habitId]: next }
    })
  }, [])

  const handleSkip = useCallback((habitId: string) => {
    setHabitStatus((prev) => ({ ...prev, [habitId]: "skipped" }))
  }, [])

  const handleUndo = useCallback((habitId: string) => {
    setHabitStatus((prev) => {
      const next = { ...prev }
      delete next[habitId]
      return next
    })
    if (habitId === "agua") {
      setWaterProgress((prev) => ({ ...prev, [habitId]: 0 }))
    }
  }, [])

  const handleModalSave = useCallback(
    (data: {
      categories?: { id: string; duration: number }[]
      note: string
      value?: number
      rating?: number
      sleepHours?: number
    }) => {
      if (!checkinHabit) return
      const habitId = checkinHabit.id
      setHabitStatus((prev) => ({ ...prev, [habitId]: "completed" }))
      if (data.note) {
        setHabitNotes((n) => ({ ...n, [habitId]: data.note }))
      }
      const isPoco = data.categories?.some((c) => c.id === "poco-ejercicio")
      if (isPoco) {
        setCompletedHabitName("Poco ejercicio 💪")
      } else {
        triggerCelebration(habitId)
      }
    },
    [checkinHabit, triggerCelebration]
  )

  const sectionContent = () => {
    switch (activeSection) {
      case "goals":
        return (
          <div className="mb-8">
            <MetasSection />
          </div>
        )
      case "history":
        return (
          <div className="mb-8">
            <HistorySection />
          </div>
        )
      default:
        return null
    }
  }

  if (activeSection !== "dashboard") {
    return (
      <>
        <DashboardLayout>
          {sectionContent()}
          <FAB />
        </DashboardLayout>
        {checkinHabit && (
          <CheckinModal
            habit={checkinHabit}
            isOpen={!!checkinHabit}
            onClose={() => setCheckinHabit(null)}
            onSave={handleModalSave}
            accent="pablo"
          />
        )}
        <CelebrationModal
          habitName={completedHabitName || ""}
          isOpen={!!completedHabitName}
          onClose={() => setCompletedHabitName(null)}
        />
      </>
    )
  }

  return (
    <>
      <DashboardLayout>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-label-caps text-on-surface-variant uppercase tracking-[0.15em] font-semibold">
              Hoy, 15 de Octubre
            </p>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-background font-bold tracking-tight">
              ¡Hola, Pablo!
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-pablo/20 to-accent-pablo/5 flex items-center justify-center text-accent-pablo font-bold text-sm border border-white/40 shadow-sm">
            P
          </div>
        </div>

        <MotivationalMessage primeStreak={4} pabloStreak={8} julioStreak={5} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <RecentFeed />
          <WeekComparison thisWeek={47} lastWeek={38} />
        </div>

        <div className="flex items-center gap-3 mt-1">
          <div className="flex-1 h-px bg-gradient-to-r from-primary/20 via-accent-pablo/10 to-transparent" />
          <h2 className="text-headline-md text-on-background font-bold tracking-tight flex items-center gap-2.5">
            Hábitos de Hoy
            <span className="text-body-sm font-normal text-on-surface-variant bg-white/50 px-3 py-1 rounded-full">
              {allHabits.filter((h) => getStatus(h.id) === "completed").length}/{allHabits.length}
            </span>
          </h2>
          <div className="flex-1 h-px bg-gradient-to-l from-accent-julio/20 via-accent-julio/10 to-transparent" />
        </div>

        <div className="flex flex-col lg:flex-row gap-gutter mb-8">
          <div className="flex-1 min-w-0">
            <section className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {allHabits.map((h) => {
                  const status = getStatus(h.id)
                  const isAgua = h.id === "agua"
                  return (
                    <div
                      key={h.id}
                      className={isAgua ? "md:col-span-2" : ""}
                    >
                      <HabitCard
                        habitId={h.id}
                        name={h.name}
                        icon={h.icon}
                        streak={h.streak}
                        totalDays={h.totalDays}
                        accent={h.accent}
                        cardStatus={status}
                        interaction={h.interaction}
                        userStatus={{
                          name: "Pablo",
                          accent: "pablo",
                          done: status === "completed",
                        }}
                        partnerStatus={{
                          name: "Julio",
                          accent: "julio",
                          done: h.partnerDone,
                        }}
                        progress={{
                          current: waterProgress[h.id] || 0,
                          total: 8,
                        }}
                        fullWidth={isAgua}
                        wildcard={h.id === "sin-azucar"
                          ? { label: "Salimos a beber", resultMessage: "¿Dónde amanecieron? 😂" }
                          : undefined}
                        onCheckin={handleCheckin}
                        onWaterAdd={handleWaterAdd}
                        onWaterRemove={handleWaterRemove}
                        onToggle={handleToggle}
                        onSkip={handleSkip}
                        onUndo={handleUndo}
                      />
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="mt-gutter">
              <div className="min-h-[260px]">
                <GoalsPreview />
              </div>
            </section>
          </div>

          <div className="lg:w-80 xl:w-96 flex-shrink-0 flex flex-col gap-gutter">
            <StreakPanel
              prime={4}
              team={12}
              pabloCurrent={8}
              pabloLongest={15}
              julioCurrent={5}
              julioLongest={12}
            />
            <AhorroPersonal />
          </div>
        </div>

        <FAB />
      </DashboardLayout>

      {checkinHabit && (
        <CheckinModal
          habit={checkinHabit}
          isOpen={!!checkinHabit}
          onClose={() => setCheckinHabit(null)}
          onSave={handleModalSave}
          accent="pablo"
        />
      )}

      <CelebrationModal
        habitName={completedHabitName || ""}
        isOpen={!!completedHabitName}
        onClose={() => setCompletedHabitName(null)}
      />
    </>
  )
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/login")
    }
  }, [mounted, loading, user, router])

  if (!mounted) return <>{children}</>

  if (loading) return null
  if (!user) return null
  return <>{children}</>
}

export function DashboardClient() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <AuthGuard>
          <DashboardContent />
          <NewGoalModal />
        </AuthGuard>
      </DashboardProvider>
    </AuthProvider>
  )
}
