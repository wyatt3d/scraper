"use client"

import { useState, useCallback } from "react"

import { CommandPalette } from "@/components/dashboard/command-palette"
import { KeyboardShortcuts } from "@/components/dashboard/keyboard-shortcuts"

export function DashboardShortcuts() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  const handleOpenShortcuts = useCallback(() => {
    setShortcutsOpen(true)
  }, [])

  return (
    <>
      <CommandPalette onOpenShortcuts={handleOpenShortcuts} />
      <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </>
  )
}
