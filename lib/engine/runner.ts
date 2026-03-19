import { scrapeWithBrowser } from "./scraper"
import type { Flow, FlowStep, RunLog } from "../types"
import * as cheerio from "cheerio"

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

  const log = (level: RunLog["level"], message: string, step?: string) => {
    logs.push({ timestamp: new Date().toISOString(), level, message, step })
  }

  log("info", `Starting flow "${flow.name}"`)
  log("info", `Target URL: ${flow.url}`)

  const browserlessUrl = process.env.BROWSERLESS_URL
  const browserlessToken = process.env.BROWSERLESS_TOKEN

  const hasInteractiveSteps = flow.steps.some((s) =>
    ["click", "fill", "scroll", "screenshot"].includes(s.type)
  )

  if (hasInteractiveSteps && browserlessUrl && browserlessToken) {
    return executeInteractiveFlow(flow, logs, items, start)
  }

  return executeSimpleFlow(flow, logs, items, start)
}

async function executeInteractiveFlow(
  flow: Flow,
  logs: RunLog[],
  items: Record<string, unknown>[],
  start: number
): Promise<RunResult> {
  const browserlessUrl = process.env.BROWSERLESS_URL!
  const browserlessToken = process.env.BROWSERLESS_TOKEN!

  const log = (level: RunLog["level"], message: string, step?: string) => {
    logs.push({ timestamp: new Date().toISOString(), level, message, step })
  }

  try {
    const script = buildPlaywrightScript(flow)
    log("info", "Executing interactive flow via browser engine")

    const response = await fetch(
      `${browserlessUrl}/function?token=${browserlessToken}&stealth`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: script,
          context: {
            url: flow.url,
            steps: flow.steps,
          },
        }),
        signal: AbortSignal.timeout(60000),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      log("error", `Browser execution failed: ${response.status} ${errorText}`)
      log("info", "Falling back to simple extraction")
      return executeSimpleFlow(flow, logs, items, start)
    }

    const result = await response.json()

    // Process extraction results from each step (captured inline during execution)
    if (result.results && Array.isArray(result.results)) {
      for (const stepResult of result.results) {
        if (stepResult.html && stepResult.rules) {
          const $ = cheerio.load(stepResult.html)
          log("info", `Analyzing page: ${stepResult.pageUrl}`, stepResult.stepId)
          for (const rule of stepResult.rules) {
            $(rule.selector).each((_: number, el: cheerio.AnyNode) => {
              const value = rule.attribute
                ? $(el).attr(rule.attribute)
                : $(el).text().trim()
              if (value) {
                const item: Record<string, unknown> = {}
                item[rule.field] = value
                items.push(item)
              }
            })
          }
          log("info", `Extracted ${items.length} items so far from ${stepResult.pageUrl}`, stepResult.stepId)
        }
      }
    }

    // Also try the final page HTML if no inline results
    if (items.length === 0 && result.html) {
      const $ = cheerio.load(result.html)
      const extractSteps = flow.steps.filter((s) => s.type === "extract")
      for (const step of extractSteps) {
        if (step.extractionRules) {
          for (const rule of step.extractionRules) {
            $(rule.selector).each((_: number, el: cheerio.AnyNode) => {
              const value = rule.attribute
                ? $(el).attr(rule.attribute)
                : $(el).text().trim()
              if (value) {
                const item: Record<string, unknown> = {}
                item[rule.field] = value
                items.push(item)
              }
            })
          }
        }
      }
      log("info", `Extracted ${items.length} items from final page`)
    }

    log("info", `Flow completed. ${items.length} items extracted.`)
    return { status: "completed", items, logs, duration: Date.now() - start }
  } catch (err) {
    const error =
      err instanceof Error ? err.message : "Interactive flow failed"
    log("error", error)
    log("info", "Falling back to simple extraction")
    return executeSimpleFlow(flow, logs, items, start)
  }
}

function buildPlaywrightScript(flow: Flow): string {
  const stepCode = flow.steps
    .map((step, i) => {
      switch (step.type) {
        case "navigate":
          return `
          // Step ${i + 1}: ${step.label}
          await page.goto(context.url, { waitUntil: 'networkidle2', timeout: 30000 });
        `
        case "wait":
          return `
          // Step ${i + 1}: ${step.label}
          await page.waitForTimeout(${Math.min(parseInt(step.value || "2000"), 5000)});
        `
        case "click":
          return `
          // Step ${i + 1}: ${step.label}
          try {
            const selectors_${i} = ${JSON.stringify(step.selector?.split(", ") || [])};
            let clicked_${i} = false;
            for (const sel of selectors_${i}) {
              try {
                await page.waitForSelector(sel, { timeout: 5000 });
                await page.click(sel);
                clicked_${i} = true;
                break;
              } catch {}
            }
            if (!clicked_${i}) {
              console.log('Could not find clickable element for step ${i + 1}');
            }
            await page.waitForTimeout(2000);
          } catch (e) {
            console.log('Click failed for step ${i + 1}:', e.message);
          }
        `
        case "fill": {
          const selector = (step.selector || "").replace(/'/g, "\\'")
          const value = (step.value || "").replace(/'/g, "\\'")
          return `
          // Step ${i + 1}: ${step.label}
          try {
            await page.waitForSelector('${selector}', { timeout: 5000 });
            await page.type('${selector}', '${value}');
            await page.waitForTimeout(500);
          } catch (e) {
            console.log('Fill failed for step ${i + 1}:', e.message);
          }
        `
        }
        case "scroll":
          return `
          // Step ${i + 1}: ${step.label}
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(2000);
        `
        case "extract": {
          const rules = step.extractionRules || []
          const rulesJson = JSON.stringify(rules)
          return `
          // Step ${i + 1}: ${step.label}
          {
            const pageHtml_${i} = await page.content();
            const extractionRules_${i} = ${rulesJson};
            results.push({ stepId: '${step.id}', html: pageHtml_${i}, rules: extractionRules_${i}, pageUrl: page.url() });
          }
        `
        }
        default:
          return `// Step ${i + 1}: ${step.label} (${step.type})`
      }
    })
    .join("\n")

  return `
    module.exports = async ({ page, context }) => {
      const results = [];
      try {
        ${stepCode}

        // Also capture final page state
        const html = await page.content();
        const url = page.url();
        return { html, url, results, success: true };
      } catch (error) {
        return { error: error.message, results, success: false };
      }
    };
  `
}

async function executeSimpleFlow(
  flow: Flow,
  logs: RunLog[],
  items: Record<string, unknown>[],
  start: number
): Promise<RunResult> {
  const log = (level: RunLog["level"], message: string, step?: string) => {
    logs.push({ timestamp: new Date().toISOString(), level, message, step })
  }

  let currentUrl = flow.url

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
            transform: r.transform as
              | "text"
              | "html"
              | "number"
              | "url"
              | undefined,
          }))

          const result = await scrapeWithBrowser(currentUrl, rules)
          if (result.success) {
            items.push(...result.items)
            log(
              "info",
              `Extracted ${result.items.length} items in ${result.duration}ms`,
              step.id
            )
          } else {
            log("warn", `Extraction issue: ${result.error}`, step.id)
          }
          break
        }

        case "wait": {
          const waitMs = parseInt(step.value || "2000")
          log("info", `Waiting ${waitMs}ms`, step.id)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(waitMs, 5000))
          )
          break
        }

        default:
          log(
            "info",
            `Step "${step.type}" skipped (requires browser mode)`,
            step.id
          )
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
