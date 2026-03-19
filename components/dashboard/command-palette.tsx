"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Activity,
  Bell,
  BookOpen,
  Code,
  FileText,
  Key,
  Keyboard,
  LayoutDashboard,
  LayoutTemplate,
  Moon,
  Play,
  Plus,
  Settings,
  Sparkles,
  Sun,
  Workflow,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface CommandPaletteProps {
  onOpenShortcuts?: () => void
}

export function CommandPalette({ onOpenShortcuts }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function runCommand(command: () => void) {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <LayoutDashboard />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/playground"))}>
            <Sparkles />
            <span>Playground</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/flows"))}>
            <Workflow />
            <span>Flows</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/templates"))}>
            <LayoutTemplate />
            <span>Templates</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/runs"))}>
            <Play />
            <span>Runs</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/monitoring"))}>
            <Bell />
            <span>Monitoring</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/api-keys"))}>
            <Key />
            <span>API Keys</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/flows/new"))}>
            <Plus />
            <span>Create New Flow</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/docs"))}>
            <BookOpen />
            <span>View Documentation</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/docs/api-reference"))}>
            <Code />
            <span>View API Reference</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/changelog"))}>
            <FileText />
            <span>View Changelog</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/status"))}>
            <Activity />
            <span>View Status</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))
            }
          >
            {theme === "dark" ? <Sun /> : <Moon />}
            <span>Toggle Dark Mode</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => onOpenShortcuts?.())
            }
          >
            <Keyboard />
            <span>Open Keyboard Shortcuts</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
