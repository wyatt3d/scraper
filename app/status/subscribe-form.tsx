"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function SubscribeForm() {
  const [email, setEmail] = useState("")

  function handleSubscribe() {
    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }
    toast.success("Subscribed to incident notifications", {
      description: `We'll notify ${email} about incidents.`,
    })
    setEmail("")
  }

  return (
    <form
      className="flex gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubscribe()
      }}
    >
      <Input
        type="email"
        placeholder="you@example.com"
        className="max-w-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit">Subscribe</Button>
    </form>
  )
}
