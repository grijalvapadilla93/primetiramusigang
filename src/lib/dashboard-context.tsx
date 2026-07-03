"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export interface ChecklistItem {
  text: string
  done: boolean
}

export interface ProgressEntry {
  date: string
  description: string
  amount?: number
}

export type GoalType = "daily" | "project"

export interface Goal {
  name: string
  owner: "pablo" | "julio" | "conjunta"
  category: string
  what: string
  needed: string
  checklist: ChecklistItem[]
  needsList: ChecklistItem[]
  goalType: GoalType
  needsMoney: boolean
  targetAmount?: number
  durationDays?: number
  progress: number
  target: string
  color: string
  status: "active" | "pending"
  entries: ProgressEntry[]
}

export function parseChecklist(raw: string): ChecklistItem[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((text) => ({ text, done: false }))
}

type GoalOwner = "pablo" | "julio" | "conjunta"

interface DashboardContextType {
  activeSection: string
  setActiveSection: (section: string) => void
  showGoalModal: boolean
  setShowGoalModal: (show: boolean) => void
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
  editingGoal: { goal: Goal; index: number } | null
  setEditingGoal: (e: { goal: Goal; index: number } | null) => void
  currentUser: GoalOwner
}

const DashboardContext = createContext<DashboardContextType | null>(null)

const defaultGoals: Goal[] = [
  {
    name: "Correr 5km semanales",
    owner: "pablo",
    category: "salud",
    goalType: "daily",
    needsMoney: false,
    durationDays: 90,
    what: "Correr 3 veces por semana\nEstirar después de correr",
    needed: "Zapatos cómodos\nRopa deportiva",
    checklist: [
      { text: "Correr 3 veces por semana", done: false },
      { text: "Estirar después de correr", done: false },
    ],
    needsList: [
      { text: "Zapatos cómodos", done: true },
      { text: "Ropa deportiva", done: true },
    ],
    progress: 12,
    target: "Día 12 / 90",
    color: "bg-primary",
    status: "active",
    entries: [
      { date: "28 jun", description: "Corrí 5km en 28 minutos" },
      { date: "25 jun", description: "Trote suave 3km" },
    ],
  },
  {
    name: "Leer 2 libros",
    owner: "pablo",
    category: "aprendizaje",
    goalType: "project",
    needsMoney: false,
    what: "Leer 30 min diarios\nTomar notas de cada capítulo",
    needed: "Kindle o libros físicos\nBlock de notas",
    checklist: [
      { text: "Leer 30 min diarios", done: false },
      { text: "Tomar notas de cada capítulo", done: false },
    ],
    needsList: [
      { text: "Kindle o libros físicos", done: true },
      { text: "Block de notas", done: true },
    ],
    progress: 30,
    target: "30% completado",
    color: "bg-accent-pablo",
    status: "active",
    entries: [],
  },
]

const VALID_TABS = ["dashboard", "goals", "history"] as const

function getInitialTab(): string {
  if (typeof window === "undefined") return "dashboard"
  const params = new URLSearchParams(window.location.search)
  const tab = params.get("tab")
  if (tab && (VALID_TABS as readonly string[]).includes(tab)) return tab
  return "dashboard"
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSectionState] = useState(getInitialTab)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<{ goal: Goal; index: number } | null>(null)
  const [goals, setGoals] = useState<Goal[]>(defaultGoals)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get("tab")
    if (tab && (VALID_TABS as readonly string[]).includes(tab)) {
      setActiveSectionState(tab)
    }
  }, [])

  const setActiveSection = useCallback((section: string) => {
    setActiveSectionState(section)
    const url = new URL(window.location.href)
    url.searchParams.set("tab", section)
    window.history.replaceState({}, "", url.toString())
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        activeSection,
        setActiveSection,
        showGoalModal,
        setShowGoalModal,
        goals,
        setGoals,
        editingGoal,
        setEditingGoal,
        currentUser: "pablo",
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider")
  return ctx
}
