import type { PageContext, ExtractionResult } from "./types"
import type { ExtractionRule } from "../types"

export interface Extractor {
  extract(context: PageContext, rules: ExtractionRule[]): Promise<ExtractionResult>
  inferSchema(context: PageContext, description: string): Promise<Record<string, string>>
}

export class MockExtractor implements Extractor {
  async extract(_context: PageContext, rules: ExtractionRule[]): Promise<ExtractionResult> {
    const items = Array.from({ length: 10 }, (_, i) => {
      const item: Record<string, unknown> = {}
      for (const rule of rules) {
        switch (rule.transform) {
          case "number":
            item[rule.field] = Math.round(Math.random() * 10000) / 100
            break
          case "date":
            item[rule.field] = new Date(Date.now() - Math.random() * 86400000 * 30).toISOString()
            break
          case "url":
            item[rule.field] = `https://example.com/item-${i + 1}`
            break
          default:
            item[rule.field] = `${rule.field} ${i + 1}`
        }
      }
      return item
    })

    const schema: Record<string, string> = {}
    for (const rule of rules) {
      schema[rule.field] = rule.transform || "text"
    }

    return { items, schema, totalItems: items.length, truncated: false }
  }

  async inferSchema(_context: PageContext, description: string): Promise<Record<string, string>> {
    if (description.toLowerCase().includes("product")) {
      return { name: "text", price: "number", url: "url", image: "url" }
    }
    if (description.toLowerCase().includes("job")) {
      return { title: "text", company: "text", location: "text", salary: "text", url: "url" }
    }
    return { title: "text", description: "text", url: "url" }
  }
}
