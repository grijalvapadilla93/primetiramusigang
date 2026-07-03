import { PiggyBank, CheckCircle, Circle } from "lucide-react"

interface UserStatus {
  name: string
  initial: string
  accent: "pablo" | "julio"
  done: boolean
}

const users: UserStatus[] = [
  { name: "Pablo", initial: "P", accent: "pablo", done: true },
  { name: "Julio", initial: "J", accent: "julio", done: false },
]

export function SavingsCard() {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 mt-2 max-w-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-body-lg font-semibold text-on-background">
          Ahorro de Octubre
        </span>
        <PiggyBank className="w-6 h-6 text-primary" />
      </div>
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div key={user.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  user.accent === "pablo"
                    ? "bg-accent-pablo"
                    : "bg-accent-julio"
                }`}
              >
                {user.initial}
              </div>
              <span className="text-body-lg font-medium">{user.name}</span>
            </div>
            {user.done ? (
              <CheckCircle
                className={`w-7 h-7 ${
                  user.accent === "pablo"
                    ? "text-accent-pablo"
                    : "text-accent-julio"
                }`}
                fill="currentColor"
              />
            ) : (
              <Circle className="w-7 h-7 text-outline-variant fill-outline-variant" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
