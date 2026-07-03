import { TopAppBar } from "@/components/layout/top-app-bar"
import { BottomNav } from "@/components/layout/bottom-nav"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopAppBar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-container-margin pt-[72px] flex flex-col gap-stack-lg pb-[100px] md:pb-6 relative z-10 overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
    </>
  )
}
