export type FlowStatus = "active" | "paused" | "draft" | "error"
export type RunStatus = "queued" | "running" | "completed" | "failed" | "cancelled"
export type FlowMode = "extract" | "interact" | "monitor"
export type StepType = "navigate" | "click" | "fill" | "extract" | "wait" | "scroll" | "screenshot" | "condition" | "loop"

export interface Flow {
  id: string
  name: string
  description: string
  url: string
  mode: FlowMode
  status: FlowStatus
  steps: FlowStep[]
  outputSchema: Record<string, unknown>
  schedule?: CronSchedule
  createdAt: string
  updatedAt: string
  lastRunAt?: string
  successRate: number
  totalRuns: number
  avgDuration: number
}

export interface FlowStep {
  id: string
  type: StepType
  label: string
  selector?: string
  value?: string
  extractionRules?: ExtractionRule[]
  condition?: string
  children?: FlowStep[]
}

export interface ExtractionRule {
  field: string
  selector: string
  attribute?: string
  transform?: "text" | "html" | "number" | "date" | "url"
}

export interface Run {
  id: string
  flowId: string
  flowName: string
  status: RunStatus
  startedAt: string
  completedAt?: string
  duration?: number
  itemsExtracted: number
  error?: string
  outputPreview?: Record<string, unknown>[]
  logs: RunLog[]
  cost: number
}

export interface RunLog {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  step?: string
}

export interface CronSchedule {
  expression: string
  timezone: string
  enabled: boolean
}

export interface ApiKey {
  id: string
  name: string
  key: string
  prefix: string
  createdAt: string
  lastUsedAt?: string
  scopes: string[]
}

export interface UserSettings {
  name: string
  email: string
  avatar?: string
  plan: "free" | "starter" | "professional" | "enterprise"
  usage: {
    runsUsed: number
    runsLimit: number
    apiCallsUsed: number
    apiCallsLimit: number
  }
}

export interface MonitorAlert {
  id: string
  flowId: string
  flowName: string
  type: "change_detected" | "threshold" | "error" | "schedule_missed"
  message: string
  severity: "info" | "warning" | "critical"
  createdAt: string
  acknowledged: boolean
}

export interface FlowTemplate {
  id: string
  name: string
  description: string
  category: string
  mode: FlowMode
  url: string
  steps: FlowStep[]
  outputSchema: Record<string, unknown>
}

export interface ElementInfo {
  selector: string
  tagName: string
  text: string
  rect: { x: number; y: number; width: number; height: number }
  isInteractive: boolean
  type: "link" | "button" | "input" | "text" | "image" | "container"
}

export interface RecorderAction {
  type: "click" | "fill" | "scroll" | "wait"
  selector: string
  value?: string
}
