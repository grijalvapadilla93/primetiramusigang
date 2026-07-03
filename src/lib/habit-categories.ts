export interface Category {
  id: string
  label: string
  icon: string
}

export type HabitInteraction = "modal" | "counter" | "toggle"

export interface HabitMeta {
  id: string
  name: string
  icon: "dumbbell" | "droplet" | "pill" | "stretch" | "sparkles" | "moon" | "spray"
  interaction: HabitInteraction
  targetValue?: number
  unit?: string
  categories: Category[]
  multiSelect?: boolean
}

export const habitDefinitions: HabitMeta[] = [
  {
    id: "entrenamiento",
    name: "Entrenamiento",
    icon: "dumbbell",
    interaction: "modal",
    multiSelect: true,
    categories: [
      { id: "cardio", label: "Cardio", icon: "directions_run" },
      { id: "pesas", label: "Pesas", icon: "fitness_center" },
      { id: "entrenamiento", label: "Entrenamiento", icon: "fitness_center" },
      { id: "poco-ejercicio", label: "Poco ejercicio 💪", icon: "fitness_center" },
    ],
  },
  {
    id: "vitaminas",
    name: "Vitaminas",
    icon: "pill",
    interaction: "toggle",
    categories: [],
  },
  {
    id: "estiramiento",
    name: "Estiramiento",
    icon: "stretch",
    interaction: "toggle",
    categories: [],
  },
  {
    id: "sin-azucar",
    name: "Sin Azúcar",
    icon: "sparkles",
    interaction: "toggle",
    categories: [],
  },
  {
    id: "sueno",
    name: "Sueño (anoche)",
    icon: "moon",
    interaction: "modal",
    categories: [],
  },
  {
    id: "skincare",
    name: "Skincare",
    icon: "spray",
    interaction: "toggle",
    categories: [],
  },
  {
    id: "agua",
    name: "Agua (2L)",
    icon: "droplet",
    interaction: "counter",
    targetValue: 8,
    unit: "vasos",
    categories: [],
  },
]

export function getHabitMeta(id: string): HabitMeta | undefined {
  return habitDefinitions.find((h) => h.id === id)
}
