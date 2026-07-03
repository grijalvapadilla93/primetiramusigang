"use client"

import { Plus } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"

export function FAB() {
  const { setShowGoalModal } = useDashboard()

  return (
    <button
      onClick={() => setShowGoalModal(true)}
      className="fixed bottom-[100px] md:bottom-container-margin right-container-margin z-40 flex items-center gap-2 bg-primary text-on-primary px-6 py-4 rounded-full shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 transition-all text-body-lg font-bold cursor-pointer"
    >
      <Plus className="w-5 h-5" />
      Nueva Meta
    </button>
  )
}
