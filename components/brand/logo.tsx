import { cn } from "@/lib/utils"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
  showDot?: boolean
}

export function Logo({ size = "md", href = "/", className, showDot = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  }

  const content = (
    <span className={cn("inline-flex items-baseline gap-0", sizeClasses[size], className)}>
      <span className="font-serif font-bold tracking-tight">Scraper</span>
      <span className="font-serif font-bold tracking-tight text-blue-600">.bot</span>
    </span>
  )

  if (href) {
    return <Link href={href} className="hover:opacity-80 transition-opacity">{content}</Link>
  }

  return content
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center rounded-md bg-blue-600 text-white font-serif font-bold", className)}>
      S
    </span>
  )
}
