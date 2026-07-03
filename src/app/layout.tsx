import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ServiceWorkerRegister } from "@/components/service-worker-register"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Modo Prime - Dashboard",
  description: "El dashboard de hábitos para Pablo y Julio",
  manifest: "/manifest.json",
  icons: {
    apple: "/images/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Modo Prime",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#005ab3",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-on-background font-sans">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
