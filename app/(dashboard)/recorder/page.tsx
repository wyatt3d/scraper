"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  MousePointer, Save, ArrowLeft, Trash2,
} from "lucide-react"
import { RecorderPanel } from "@/components/recorder/recorder-panel"
import { useRecorder } from "@/components/recorder/use-recorder"
import type { FlowStep } from "@/lib/types"

export default function RecorderPage() {
  const router = useRouter()
  const recorder = useRecorder()
  const [flowName, setFlowName] = useState("")
  const [steps, setSteps] = useState<FlowStep[]>([])

  const handleAddStep = (step: Omit<FlowStep, "id">) => {
    const newStep: FlowStep = { ...step, id: `step-${Date.now()}` }
    setSteps(prev => [...prev, newStep])
  }

  const handleRemoveStep = (id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id))
  }

  const handleSaveFlow = async () => {
    if (!flowName.trim()) {
      toast.error("Give your flow a name")
      return
    }
    if (steps.length === 0) {
      toast.error("Record at least one step")
      return
    }

    try {
      const res = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: flowName,
          description: `Recorded flow with ${steps.length} steps`,
          url: recorder.currentUrl || steps[0]?.selector || "",
          mode: steps.some(s => s.type === "extract") ? "extract" : "interact",
          steps,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Flow saved!")
      router.push(`/flows/${data.data?.id || ""}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save flow")
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/flows")} aria-label="Back to flows">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-bold">Record a Flow</h1>
            <p className="text-sm text-muted-foreground">Navigate a site, click elements, and build your scraping flow visually</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            placeholder="Flow name..."
            className="w-56 h-9"
          />
          <Button onClick={handleSaveFlow} disabled={steps.length === 0} className="gap-1.5">
            <Save className="size-4" />
            Save Flow
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 border border-border rounded-lg overflow-hidden">
          <RecorderPanel
            url={recorder.currentUrl}
            screenshot={recorder.screenshot}
            elements={recorder.elements}
            selectedElement={recorder.selectedElement}
            isLoading={recorder.isLoading}
            mode={recorder.mode}
            currentUrl={recorder.currentUrl}
            error={recorder.error}
            onStart={recorder.startRecording}
            onAction={(action, url) => recorder.performAction(action, url)}
            onSelectElement={recorder.selectElement}
            onSetMode={recorder.setMode}
            onAddStep={handleAddStep}
            onStop={recorder.stopRecording}
          />
        </div>

        <div className="w-72 border border-border rounded-lg flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Recorded Steps</h3>
              <Badge variant="outline" className="text-xs">{steps.length}</Badge>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {steps.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MousePointer className="size-8 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Enter a URL and start clicking to record steps
                </p>
              </div>
            ) : (
              steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 group">
                  <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{step.label}</div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate">{step.selector}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5 shrink-0">{step.type}</Badge>
                  <button
                    onClick={() => handleRemoveStep(step.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove step"
                  >
                    <Trash2 className="size-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
          {steps.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button onClick={handleSaveFlow} className="w-full gap-1.5" size="sm">
                <Save className="size-3.5" />
                Save Flow ({steps.length} steps)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
