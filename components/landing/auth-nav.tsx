"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface AuthNavProps {
  isSignedIn: boolean
}

export function AuthNavDesktop({ isSignedIn }: AuthNavProps) {
  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Go to Dashboard
        </Button>
      </Link>
    )
  }

  return (
    <>
      <Link href="/sign-in">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Get Started Free
        </Button>
      </Link>
    </>
  )
}

export function AuthNavMobile({ isSignedIn, onNavigate }: AuthNavProps & { onNavigate?: () => void }) {
  if (isSignedIn) {
    return (
      <Link href="/dashboard" onClick={onNavigate}>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Go to Dashboard
        </Button>
      </Link>
    )
  }

  return (
    <>
      <Link href="/sign-in" onClick={onNavigate}>
        <Button variant="outline" className="w-full">
          Sign In
        </Button>
      </Link>
      <Link href="/sign-up" onClick={onNavigate}>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Get Started Free
        </Button>
      </Link>
    </>
  )
}

export function HeroCTA({ isSignedIn }: AuthNavProps) {
  return (
    <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
        {isSignedIn ? "Go to Dashboard" : "Start Building Free"}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </Link>
  )
}
