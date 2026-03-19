import type React from "react"
import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-12">
      <Link href="/" className="mb-8">
        <Image
          src="/images/scraper-logo.png"
          alt="Scraper"
          width={160}
          height={160}
          className="rounded-lg"
        />
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
