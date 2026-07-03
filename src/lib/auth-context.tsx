"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// ── Supabase client (lazy) ───────────────────────────────────
// Set in Vercel project settings → Environment Variables:
//   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      // Return a dummy during SSR/prerender — real client is only needed client-side
      return createClient("https://placeholder.supabase.co", "placeholder-key")
    }
    _supabase = createClient(url, key)
  }
  return _supabase
}

export { getSupabase }

// ── Types ────────────────────────────────────────────────────
export interface AppUser {
  id: string
  email: string
  display_name: string
  accent: "pablo" | "julio"
  color: string
  weekly_goal: number
  mascot_mood: "energized" | "neutral" | "slacking"
  total_points: number
}

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

// ── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null)

// ── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch the profile row that matches the auth user
  const loadProfile = useCallback(async (authUserId: string) => {
    const { data, error } = await getSupabase()
      .from("profiles")
      .select("id, display_name, email, accent, color, weekly_goal, mascot_mood, total_points")
      .eq("id", authUserId)
      .single()

    if (error || !data) {
      console.error("Profile not found:", error)
      setUser(null)
      return
    }

    setUser({
      id: data.id,
      email: data.email,
      display_name: data.display_name,
      accent: data.accent as "pablo" | "julio",
      color: data.color,
      weekly_goal: data.weekly_goal,
      mascot_mood: data.mascot_mood as AppUser["mascot_mood"],
      total_points: data.total_points,
    })
  }, [])

  // On mount: check if there's already a session
  useEffect(() => {
    const sb = getSupabase()
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for login/logout events
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadProfile])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const logout = useCallback(async () => {
    await getSupabase().auth.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
