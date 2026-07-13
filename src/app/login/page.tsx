"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { User, Lock, LogIn, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!username.trim() || !password.trim()) {
      setError("Completa todos los campos")
      return
    }
    setSubmitting(true)
    const result = await login(username, password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else {
      router.replace("/")
    }
  }

  const setUser = (name: string) => {
    setUsername(name)
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass-deep rounded-3xl p-8 flex flex-col gap-7 relative z-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-lg shadow-sm">
            MP
          </div>
          <div>
            <h1 className="text-headline-lg font-bold text-on-background tracking-tight">Modo Prime</h1>
            <p className="text-body-sm text-on-surface-variant mt-1">Elige tu usuario</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            {(["pablo", "julio"] as const).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setUser(name)}
                className={cn(
                  "flex-1 h-12 rounded-xl font-bold text-body-sm capitalize transition-all cursor-pointer",
                  username === name
                    ? name === "pablo"
                      ? "bg-[#0A84FF] text-white shadow-sm"
                      : "bg-[#FF9F0A] text-white shadow-sm"
                    : "glass-strong text-on-surface-variant hover:text-on-background"
                )}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-label-caps text-on-surface-variant uppercase tracking-wider">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl glass-strong text-body-sm text-on-background placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-body-sm text-error text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !username}
            className="w-full h-11 rounded-xl bg-primary text-white text-body-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm cursor-pointer disabled:opacity-40"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {submitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-label-caps text-on-surface-variant text-center">
          Ambos usan la misma contraseña
        </p>
      </div>
    </div>
  )
}
