import type { PageContext, ObserverResult } from "./types"

export interface Observer {
  observe(context: PageContext): Promise<ObserverResult>
  findElement(context: PageContext, description: string): Promise<string | null>
  getPageState(context: PageContext): Promise<Record<string, unknown>>
}

export class MockObserver implements Observer {
  async observe(context: PageContext): Promise<ObserverResult> {
    return {
      elements: [
        { selector: "h1", tag: "h1", text: "Page Title", attributes: {}, visible: true, interactable: false, bounds: { x: 0, y: 0, width: 800, height: 40 } },
        { selector: ".product-card", tag: "div", text: "", attributes: { class: "product-card" }, visible: true, interactable: true, bounds: { x: 0, y: 100, width: 300, height: 200 } },
      ],
      forms: [],
      links: [
        { href: "/page/2", text: "Next", selector: ".pagination .next", isExternal: false },
      ],
      metadata: {
        title: "Example Page",
        description: "An example page for scraping",
        contentType: "text/html",
        language: "en",
      },
    }
  }

  async findElement(_context: PageContext, description: string): Promise<string | null> {
    const selectorMap: Record<string, string> = {
      "product title": ".product-title",
      "price": ".price",
      "next page": ".pagination .next",
      "search input": "#search-input",
      "submit button": "button[type=submit]",
    }
    const key = Object.keys(selectorMap).find((k) => description.toLowerCase().includes(k))
    return key ? selectorMap[key] : null
  }

  async getPageState(_context: PageContext): Promise<Record<string, unknown>> {
    return { loaded: true, hasNextPage: true, itemCount: 24 }
  }
}
