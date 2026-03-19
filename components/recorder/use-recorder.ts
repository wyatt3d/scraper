"use client"

import { useState, useCallback } from "react"
import type { ElementInfo, RecorderAction } from "@/lib/types"

interface RecorderState {
  isActive: boolean
  isLoading: boolean
  screenshot: string | null
  elements: ElementInfo[]
  actions: RecorderAction[]
  currentUrl: string
  selectedElement: ElementInfo | null
  mode: "select" | "click" | "fill" | "extract" | "scroll"
  error: string | null
}

export function useRecorder() {
  const [state, setState] = useState<RecorderState>({
    isActive: false,
    isLoading: false,
    screenshot: null,
    elements: [],
    actions: [],
    currentUrl: "",
    selectedElement: null,
    mode: "select",
    error: null,
  })

  const startRecording = useCallback(async (url: string) => {
    setState(s => ({ ...s, isLoading: true, isActive: true, error: null, actions: [] }))
    try {
      const res = await fetch("/api/recorder/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setState(s => ({
        ...s,
        isLoading: false,
        screenshot: data.screenshot,
        elements: data.elements || [],
        currentUrl: data.currentUrl || url,
      }))
    } catch (err) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to start",
      }))
    }
  }, [])

  const performAction = useCallback(async (action: RecorderAction, url: string) => {
    setState(s => ({ ...s, isLoading: true }))
    const newActions = [...state.actions, action]
    try {
      const res = await fetch("/api/recorder/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, actions: newActions }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setState(s => ({
        ...s,
        isLoading: false,
        actions: newActions,
        screenshot: data.screenshot,
        elements: data.elements || [],
        currentUrl: data.currentUrl || url,
        selectedElement: null,
      }))
    } catch (err) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Action failed",
      }))
    }
  }, [state.actions])

  const selectElement = useCallback((el: ElementInfo | null) => {
    setState(s => ({ ...s, selectedElement: el }))
  }, [])

  const setMode = useCallback((mode: RecorderState["mode"]) => {
    setState(s => ({ ...s, mode }))
  }, [])

  const stopRecording = useCallback(() => {
    setState(s => ({ ...s, isActive: false, screenshot: null, elements: [], selectedElement: null }))
  }, [])

  return { ...state, startRecording, performAction, selectElement, setMode, stopRecording }
}
