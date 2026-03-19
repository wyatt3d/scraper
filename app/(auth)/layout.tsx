import type React from "react"
import { Logo } from "@/components/brand/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/5 via-background to-blue-600/5 px-4 py-12">
      <div className="mb-8">
        <Logo size="lg" href="/" />
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
