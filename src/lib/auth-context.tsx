"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface AuthContextType {
  user: { email: string; name: string } | null
  loading: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("mp_user")
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem("mp_user") }
    }
    setLoading(false)
  }, [])

  const login = useCallback((email: string, _password: string): boolean => {
    const name = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    const u = { email, name }
    localStorage.setItem("mp_user", JSON.stringify(u))
    setUser(u)
    return true
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("mp_user")
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
