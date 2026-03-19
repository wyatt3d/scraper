"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="bg-muted border rounded px-2 py-0.5 font-mono text-sm">
      {children}
    </kbd>
  )
}

const navigationShortcuts = [
  { keys: ["Cmd", "K"], action: "Command palette" },
  { keys: ["G", "D"], action: "Go to Dashboard" },
  { keys: ["G", "F"], action: "Go to Flows" },
  { keys: ["G", "R"], action: "Go to Runs" },
  { keys: ["G", "P"], action: "Go to Playground" },
  { keys: ["G", "S"], action: "Go to Settings" },
]

const actionShortcuts = [
  { keys: ["N"], action: "New Flow" },
  { keys: ["?"], action: "This help dialog" },
  { keys: ["Esc"], action: "Close dialog/modal" },
]

const editorShortcuts = [
  { keys: ["Cmd", "S"], action: "Save flow" },
  { keys: ["Cmd", "Enter"], action: "Run flow" },
]

function ShortcutTable({
  title,
  shortcuts,
}: {
  title: string
  shortcuts: { keys: string[]; action: string }[]
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.action}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{shortcut.action}</span>
            <div className="flex items-center gap-1">
              {shortcut.keys.map((key, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-muted-foreground text-xs">+</span>}
                  <Kbd>{key}</Kbd>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface KeyboardShortcutsProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function KeyboardShortcuts({ open: controlledOpen, onOpenChange }: KeyboardShortcutsProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  const router = useRouter()
  const gPressedRef = useRef(false)
  const gTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openModal = useCallback(() => setOpen(true), [])

  useEffect(() => {
    function isInputFocused() {
      const el = document.activeElement
      if (!el) return false
      const tag = el.tagName.toLowerCase()
      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (el as HTMLElement).isContentEditable
      )
    }

    function onKeyDown(e: KeyboardEvent) {
      if (isInputFocused()) return

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        openModal()
        return
      }

      if (e.key === "n" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        router.push("/flows/new")
        return
      }

      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        gPressedRef.current = true
        if (gTimerRef.current) clearTimeout(gTimerRef.current)
        gTimerRef.current = setTimeout(() => {
          gPressedRef.current = false
        }, 1000)
        return
      }

      if (gPressedRef.current) {
        gPressedRef.current = false
        if (gTimerRef.current) clearTimeout(gTimerRef.current)

        const routes: Record<string, string> = {
          d: "/dashboard",
          f: "/flows",
          r: "/runs",
          p: "/playground",
          s: "/settings",
        }

        const route = routes[e.key]
        if (route) {
          e.preventDefault()
          router.push(route)
        }
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      if (gTimerRef.current) clearTimeout(gTimerRef.current)
    }
  }, [openModal, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="sr-only">
            List of available keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <ShortcutTable title="Navigation" shortcuts={navigationShortcuts} />
          <ShortcutTable title="Actions" shortcuts={actionShortcuts} />
          <ShortcutTable title="Editor" shortcuts={editorShortcuts} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
