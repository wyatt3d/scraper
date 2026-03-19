export interface PageContext {
  url: string
  title: string
  html: string
  cookies: Record<string, string>
  headers: Record<string, string>
  screenshot?: string
}

export interface ObserverResult {
  elements: ElementInfo[]
  forms: FormInfo[]
  links: LinkInfo[]
  metadata: PageMetadata
}

export interface ElementInfo {
  selector: string
  tag: string
  text: string
  attributes: Record<string, string>
  visible: boolean
  interactable: boolean
  bounds: { x: number; y: number; width: number; height: number }
}

export interface FormInfo {
  selector: string
  action: string
  method: string
  fields: FormField[]
}

export interface FormField {
  name: string
  type: string
  selector: string
  required: boolean
  placeholder?: string
  options?: string[]
}

export interface LinkInfo {
  href: string
  text: string
  selector: string
  isExternal: boolean
}

export interface PageMetadata {
  title: string
  description?: string
  canonicalUrl?: string
  language?: string
  contentType: string
}

export interface StepResult {
  success: boolean
  duration: number
  error?: string
  data?: unknown
  screenshot?: string
}

export interface ExtractionResult {
  items: Record<string, unknown>[]
  schema: Record<string, string>
  totalItems: number
  truncated: boolean
}

export type EngineMode = "browserless" | "headless" | "hybrid"
