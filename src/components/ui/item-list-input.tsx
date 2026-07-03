"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ItemListInputProps {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  emptyLabel?: string
}

export function ItemListInput({ items, onChange, placeholder = "Escribe un ítem...", emptyLabel }: ItemListInputProps) {
  const [input, setInput] = useState("")

  const addItem = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onChange([...items, trimmed])
    setInput("")
  }

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {items.length === 0 && emptyLabel && (
        <p className="text-body-sm text-on-surface-variant/60 italic">{emptyLabel}</p>
      )}
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <div className="flex-1 px-3.5 py-2 rounded-xl bg-white/60 border border-white/40 text-body-sm text-on-surface">
              {item}
            </div>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="w-7 h-7 rounded-lg glass-strong flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all flex-shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-white/60 border border-white/40 rounded-xl py-2 px-3.5 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!input.trim()}
          className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer",
            input.trim()
              ? "bg-primary text-on-primary hover:opacity-90"
              : "glass text-on-surface-variant/40 cursor-not-allowed"
          )}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
