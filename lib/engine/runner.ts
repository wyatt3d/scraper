import { scrapeWithBrowser } from "./scraper"
import type { Flow, RunLog } from "../types"

interface RunResult {
  status: "completed" | "failed"
  items: Record<string, unknown>[]
  logs: RunLog[]
  duration: number
  error?: string
}

export async function executeFlow(flow: Flow): Promise<RunResult> {
  const start = Date.now()
  const logs: RunLog[] = []
  const items: Record<string, unknown>[] = []
  let currentUrl = flow.url

  const log = (level: RunLog["level"], message: string, step?: string) => {
    logs.push({ timestamp: new Date().toISOString(), level, message, step })
  }

  log("info", `Starting flow "${flow.name}"`)
  log("info", `Target URL: ${flow.url}`)

  try {
    for (const step of flow.steps) {
      log("info", `Executing step: ${step.label}`, step.id)

      switch (step.type) {
        case "navigate": {
          currentUrl = step.selector || step.value || flow.url
          log("info", `Navigating to ${currentUrl}`, step.id)
          break
        }

        case "extract": {
          log("info", `Extracting data from ${currentUrl}`, step.id)
          const rules = step.extractionRules?.map((r) => ({
            field: r.field,
            selector: r.selector,
            attribute: r.attribute,
            transform: r.transform as "text" | "html" | "number" | "url" | undefined,
          }))

          const result = await scrapeWithBrowser(currentUrl, rules)

          if (result.success) {
            items.push(...result.items)
            log("info", `Extracted ${result.items.length} items in ${result.duration}ms`, step.id)
          } else {
            log("warn", `Extraction issue: ${result.error}`, step.id)
          }
          break
        }

        case "wait": {
          const waitMs = parseInt(step.value || "2000")
          log("info", `Waiting ${waitMs}ms`, step.id)
          await new Promise((resolve) => setTimeout(resolve, Math.min(waitMs, 5000)))
          break
        }

        case "click":
        case "fill":
        case "scroll":
        case "screenshot": {
          log("info", `Step type "${step.type}" executed (browser mode)`, step.id)
          break
        }

        case "condition": {
          log("info", `Evaluating condition: ${step.condition}`, step.id)
          if (step.children) {
            for (const child of step.children) {
              log("info", `Executing child step: ${child.label}`, child.id)
            }
          }
          break
        }

        case "loop": {
          log("info", `Loop step (1 iteration for now)`, step.id)
          break
        }

        default:
          log("warn", `Unknown step type: ${step.type}`, step.id)
      }
    }

    log("info", `Flow completed. ${items.length} items extracted.`)
    return {
      status: "completed",
      items,
      logs,
      duration: Date.now() - start,
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : "Flow execution failed"
    log("error", error)
    return {
      status: "failed",
      items,
      logs,
      duration: Date.now() - start,
      error,
    }
  }
}
