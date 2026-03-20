"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe, Loader2, MousePointer, Type, Database, CircleDot, X, ArrowDown, Sparkles
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { ElementInfo, RecorderAction, FlowStep } from "@/lib/types"

interface RecorderPanelProps {
  url: string
  screenshot: string | null
  elements: ElementInfo[]
  selectedElement: ElementInfo | null
  isLoading: boolean
  mode: "select" | "click" | "fill" | "extract" | "scroll"
  currentUrl: string
  error: string | null
  onStart: (url: string) => void
  onAction: (action: RecorderAction, url: string) => void
  onSelectElement: (el: ElementInfo | null) => void
  onSetMode: (mode: "select" | "click" | "fill" | "extract" | "scroll") => void
  onAddStep: (step: Omit<FlowStep, "id">) => void
  onStop: () => void
}

export function RecorderPanel({
  url, screenshot, elements, selectedElement, isLoading, mode,
  currentUrl, error, onStart, onAction, onSelectElement, onSetMode,
  onAddStep, onStop,
}: RecorderPanelProps) {
  const [inputUrl, setInputUrl] = useState(url || "")
  const [fillValue, setFillValue] = useState("")

  useEffect(() => {
    if (currentUrl && currentUrl !== inputUrl) {
      setInputUrl(currentUrl)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally sync URL bar only when currentUrl changes from API
  }, [currentUrl])

  const handleNavigate = () => {
    if (inputUrl) onStart(inputUrl)
  }

  const handleElementClick = (el: ElementInfo) => {
    if (mode === "scroll") {
      handleScroll()
      return
    }
    if (mode === "click") {
      onAction({ type: "click", selector: el.selector }, currentUrl || inputUrl)
      onAddStep({ type: "click", label: `Click ${el.text || el.tagName}`, selector: el.selector })
    } else if (mode === "extract") {
      onAddStep({
        type: "extract",
        label: `Extract ${el.text?.slice(0, 30) || el.tagName}`,
        selector: el.selector,
        extractionRules: [{ field: el.tagName, selector: el.selector, transform: "text" }],
      })
    } else {
      onSelectElement(el)
    }
  }

  const handleFill = () => {
    if (selectedElement && fillValue) {
      onAction({ type: "fill", selector: selectedElement.selector, value: fillValue }, currentUrl || inputUrl)
      onAddStep({ type: "fill", label: `Fill ${selectedElement.text || selectedElement.tagName}`, selector: selectedElement.selector, value: fillValue })
      setFillValue("")
      onSelectElement(null)
    }
  }

  const handleScroll = () => {
    onAction({ type: "scroll", selector: "window", value: "500" }, currentUrl || inputUrl)
    onAddStep({ type: "scroll", label: "Scroll down", selector: "window", value: "500" })
  }

  const handleScrollToBottom = () => {
    onAction({ type: "scroll", selector: "window", value: "bottom" }, currentUrl || inputUrl)
    onAddStep({ type: "scroll", label: "Scroll to bottom", selector: "window", value: "bottom" })
  }

  const modeConfig = {
    select: { icon: MousePointer, label: "Select", color: "bg-muted" },
    click: { icon: CircleDot, label: "Click", color: "bg-blue-600 text-white" },
    fill: { icon: Type, label: "Fill", color: "bg-emerald-600 text-white" },
    extract: { icon: Database, label: "Extract", color: "bg-purple-600 text-white" },
    scroll: { icon: ArrowDown, label: "Scroll", color: "bg-orange-600 text-white" },
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <div className="flex items-center gap-1.5 px-2">
          <CircleDot className="size-2.5 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-[10px] font-medium text-red-500 uppercase tracking-wider">REC</span>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <Globe className="size-4 text-muted-foreground shrink-0" />
          <Input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://example.com"
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
          />
        </div>
        <Button size="sm" onClick={handleNavigate} disabled={isLoading || !inputUrl}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Go"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onStop} aria-label="Stop recording">
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
        {(Object.keys(modeConfig) as Array<keyof typeof modeConfig>).map((m) => {
          const { icon: Icon, label, color } = modeConfig[m]
          return (
            <Button
              key={m}
              size="sm"
              variant={mode === m ? "default" : "ghost"}
              className={`h-7 text-xs gap-1.5 ${mode === m ? color : ""}`}
              onClick={() => onSetMode(m)}
            >
              <Icon className="size-3" />
              {label}
            </Button>
          )
        })}
        {selectedElement && mode === "fill" && (
          <div className="flex items-center gap-1 ml-auto">
            <Input
              value={fillValue}
              onChange={(e) => setFillValue(e.target.value)}
              placeholder="Type value..."
              className="h-7 w-40 text-xs"
              onKeyDown={(e) => e.key === "Enter" && handleFill()}
            />
            <Button size="sm" className="h-7 text-xs" onClick={handleFill}>Fill</Button>
          </div>
        )}
        {mode === "scroll" && (
          <div className="flex items-center gap-1 ml-auto">
            <Button size="sm" className="h-7 text-xs gap-1" onClick={handleScroll}>
              <ArrowDown className="size-3" />
              Scroll down
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={handleScrollToBottom}>
              <ArrowDown className="size-3" />
              Scroll to bottom
            </Button>
          </div>
        )}
      </div>

      {elements.length > 0 && (
        <div className="max-h-32 overflow-y-auto border-b border-border">
          <div className="grid grid-cols-1 divide-y divide-border/50">
            {elements.filter(el => el.isInteractive || el.type === "text").slice(0, 30).map((el, i) => (
              <button
                key={i}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-muted/50 transition-colors",
                  selectedElement === el && "bg-blue-600/10"
                )}
                onClick={() => handleElementClick(el)}
              >
                <Badge variant="outline" className="text-[9px] h-4 w-14 justify-center shrink-0">
                  {el.type}
                </Badge>
                <span className="truncate flex-1">{el.text || el.selector}</span>
                <span className="font-mono text-muted-foreground text-[10px] truncate max-w-[150px]">{el.selector}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedElement && mode === "select" && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-blue-600/5">
          <span className="text-xs font-mono text-muted-foreground truncate flex-1">
            {selectedElement.selector}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs gap-1"
            onClick={async () => {
              try {
                const res = await fetch("/api/suggest-selectors", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    url: currentUrl || inputUrl,
                    fieldDescription: selectedElement.text || selectedElement.tagName,
                  }),
                })
                const data = await res.json()
                if (data.selector) {
                  toast.success(`AI suggests: ${data.selector}`, { description: data.reason })
                }
              } catch {}
            }}
          >
            <Sparkles className="size-3" />
            Refine
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-auto bg-zinc-100 dark:bg-zinc-900 relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-sm text-destructive">{error}</p>
              <Button size="sm" className="mt-2" onClick={handleNavigate}>Retry</Button>
            </div>
          </div>
        )}

        {isLoading && !screenshot && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="size-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading page...</p>
            </div>
          </div>
        )}

        {screenshot && (
          <div className="relative inline-block">
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 z-20 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshot}
              alt="Page screenshot"
              className="max-w-full"
              draggable={false}
            />
          </div>
        )}

        {!screenshot && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MousePointer className="size-10 mx-auto text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground mt-3">Enter a URL above to start recording</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border text-[11px] text-muted-foreground bg-muted/30">
        <span>{selectedElement ? `Selected: ${selectedElement.text?.slice(0, 30) || selectedElement.selector}` : currentUrl || "No page loaded"}</span>
        <div className="flex items-center gap-3">
          <span>{elements.length} elements</span>
        </div>
      </div>
    </div>
  )
}
