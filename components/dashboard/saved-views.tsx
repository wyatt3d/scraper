"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  Check,
  Plus,
  Trash2,
  Bookmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface SavedView {
  id: string
  name: string
  description?: string
  filters: Record<string, string>
  isDefault?: boolean
}

interface SavedViewsProps {
  storageKey: string
  currentFilters: Record<string, string>
  onApplyView: (filters: Record<string, string>) => void
  defaultViews: SavedView[]
}

function formatFilters(filters: Record<string, string>): string {
  const parts = Object.entries(filters)
    .filter(([, v]) => v !== "all")
    .map(([k, v]) => `${k}=${v}`)
  return parts.length > 0 ? parts.join(", ") : "no filters"
}

export function SavedViews({
  storageKey,
  currentFilters,
  onApplyView,
  defaultViews,
}: SavedViewsProps) {
  const [views, setViews] = useState<SavedView[]>(defaultViews)
  const [activeViewId, setActiveViewId] = useState<string>(defaultViews[0]?.id ?? "")
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [newViewDescription, setNewViewDescription] = useState("")

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as { views: SavedView[]; activeId: string }
        setViews([...defaultViews, ...parsed.views])
        if (parsed.activeId) setActiveViewId(parsed.activeId)
      }
    } catch {
      // ignore
    }
  }, [storageKey, defaultViews])

  function persistCustomViews(allViews: SavedView[], activeId: string) {
    const custom = allViews.filter((v) => !v.isDefault)
    localStorage.setItem(storageKey, JSON.stringify({ views: custom, activeId }))
  }

  function handleSelectView(view: SavedView) {
    setActiveViewId(view.id)
    onApplyView(view.filters)
    persistCustomViews(views, view.id)
  }

  function handleSaveView() {
    if (!newViewName.trim()) return
    const id = `custom-${Date.now()}`
    const newView: SavedView = {
      id,
      name: newViewName.trim(),
      description: newViewDescription.trim() || undefined,
      filters: { ...currentFilters },
    }
    const updated = [...views, newView]
    setViews(updated)
    setActiveViewId(id)
    persistCustomViews(updated, id)
    setSaveDialogOpen(false)
    setNewViewName("")
    setNewViewDescription("")
    toast.success(`View "${newView.name}" saved`)
  }

  function handleDeleteView(viewId: string) {
    const updated = views.filter((v) => v.id !== viewId)
    setViews(updated)
    if (activeViewId === viewId) {
      const fallback = defaultViews[0]
      setActiveViewId(fallback.id)
      onApplyView(fallback.filters)
      persistCustomViews(updated, fallback.id)
    } else {
      persistCustomViews(updated, activeViewId)
    }
    toast.success("View deleted")
  }

  const activeView = views.find((v) => v.id === activeViewId) ?? defaultViews[0]

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Bookmark className="size-3.5" />
            {activeView?.name ?? "Views"}
            <ChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {views.map((view) => (
            <DropdownMenuItem
              key={view.id}
              className="flex items-center justify-between"
              onClick={() => handleSelectView(view)}
            >
              <span className={cn(view.id === activeViewId && "font-bold")}>
                {view.name}
              </span>
              <div className="flex items-center gap-1">
                {view.id === activeViewId && (
                  <Check className="size-3.5 text-blue-600" />
                )}
                {!view.isDefault && (
                  <button
                    className="rounded p-0.5 hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteView(view.id)
                    }}
                  >
                    <Trash2 className="size-3 text-muted-foreground hover:text-red-500" />
                  </button>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSaveDialogOpen(true)}>
            <Plus className="mr-2 size-3.5" />
            Save Current View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Save Current View</DialogTitle>
            <DialogDescription>
              Save the current filter configuration as a named view.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="view-name">Name</Label>
              <Input
                id="view-name"
                placeholder="e.g. My Active Flows"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="view-desc">Description (optional)</Label>
              <Input
                id="view-desc"
                placeholder="A short description..."
                value={newViewDescription}
                onChange={(e) => setNewViewDescription(e.target.value)}
              />
            </div>
            <div className="rounded-md border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Save filters: {formatFilters(currentFilters)}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveView}
              disabled={!newViewName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
