"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe, Loader2, MousePointer, Type, Database, CircleDot, X, ArrowDown
} from "lucide-react"
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
  const [hoveredElement, setHoveredElement] = useState<ElementInfo | null>(null)
  const [fillValue, setFillValue] = useState("")
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (currentUrl && currentUrl !== inputUrl) {
      setInputUrl(currentUrl)
    }
  }, [currentUrl])

  const handleNavigate = () => {
    if (inputUrl) onStart(inputUrl)
  }

  const getScaledRect = useCallback((rect: ElementInfo["rect"]) => {
    if (!imgRef.current) return null
    const scaleX = imgRef.current.clientWidth / (imgRef.current.naturalWidth || 1)
    const scaleY = imgRef.current.clientHeight / (imgRef.current.naturalHeight || 1)
    return {
      left: rect.x * scaleX,
      top: rect.y * scaleY,
      width: rect.width * scaleX,
      height: rect.height * scaleY,
    }
  }, [])

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
            <img
              ref={imgRef}
              src={screenshot}
              alt="Page screenshot"
              className="max-w-full"
              draggable={false}
            />
            {elements.map((el, i) => {
              const scaled = getScaledRect(el.rect)
              if (!scaled || scaled.width < 5 || scaled.height < 5) return null
              const isHovered = hoveredElement === el
              const isSelected = selectedElement === el
              return (
                <div
                  key={i}
                  className="absolute cursor-pointer transition-all duration-75"
                  style={{
                    left: scaled.left,
                    top: scaled.top,
                    width: scaled.width,
                    height: scaled.height,
                    border: isSelected ? "2px solid #2563eb" : isHovered ? "2px solid #3b82f6" : "1px solid transparent",
                    backgroundColor: isSelected ? "rgba(37,99,235,0.15)" : isHovered ? "rgba(59,130,246,0.1)" : "transparent",
                    zIndex: isHovered || isSelected ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredElement(el)}
                  onMouseLeave={() => setHoveredElement(null)}
                  onClick={() => handleElementClick(el)}
                />
              )
            })}
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
        <span>{currentUrl || "No page loaded"}</span>
        <div className="flex items-center gap-3">
          <span>{elements.length} elements</span>
          {hoveredElement && (
            <Badge variant="outline" className="text-[10px] h-5 font-mono">
              {hoveredElement.selector.slice(0, 40)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
