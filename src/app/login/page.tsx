"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Mail, Lock, LogIn, Loader2 } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Completa todos los campos")
      return
    }
    setSubmitting(true)
    const result = await login(email, password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else {
      router.replace("/")
    }
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
            <p className="text-body-sm text-on-surface-variant mt-1">Inicia sesión para continuar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-label-caps text-on-surface-variant uppercase tracking-wider">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                placeholder="pablo@ejemplo.com"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl glass-strong text-body-sm text-on-background placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
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
            disabled={submitting}
            className="w-full h-11 rounded-xl bg-primary text-white text-body-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm cursor-pointer disabled:opacity-40"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {submitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-label-caps text-on-surface-variant text-center">
          Demo: cualquier email y contraseña funcionan
        </p>
      </div>
    </div>
  )
}
