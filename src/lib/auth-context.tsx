"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

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

const USERS: Record<string, { password: string; profile: AppUser }> = {
  pablo: {
    password: "tequieromuchoamigopolis93?",
    profile: {
      id: "pablo-local",
      email: "pablo@modoprime.app",
      display_name: "Pablo",
      accent: "pablo",
      color: "#0A84FF",
      weekly_goal: 6,
      mascot_mood: "energized",
      total_points: 420,
    },
  },
  julio: {
    password: "tequieromuchoamigopolis93?",
    profile: {
      id: "julio-local",
      email: "julio@modoprime.app",
      display_name: "Julio",
      accent: "julio",
      color: "#FF9F0A",
      weekly_goal: 6,
      mascot_mood: "energized",
      total_points: 380,
    },
  },
}

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading] = useState(false)

  const login = useCallback(async (username: string, password: string) => {
    const key = username.toLowerCase().trim()
    const entry = USERS[key]
    if (!entry) return { error: "Usuario no encontrado" }
    if (entry.password !== password) return { error: "Contraseña incorrecta" }
    setUser(entry.profile)
    return { error: null }
  }, [])

  const logout = useCallback(async () => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
