import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SDK Reference",
}

export default function SdkPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">SDK Reference</h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
        Official TypeScript and Python SDKs for the Scraper API. Typed clients with built-in retry
        logic and error handling.
      </p>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Installation</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b">
              <span className="text-xs font-medium text-muted-foreground">npm / pip</span>
            </div>
            <pre className="bg-muted/50 p-4 overflow-x-auto">
              <code className="text-sm">{`npm install @scraper-bot/sdk
# or
pip install scraper-bot`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">TypeScript SDK</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b">
              <span className="text-xs font-medium text-muted-foreground">TypeScript</span>
            </div>
            <pre className="bg-muted/50 p-4 overflow-x-auto">
              <code className="text-sm">{`import { ScraperBot } from '@scraper-bot/sdk'

const client = new ScraperBot({ apiKey: 'scr_live_...' })

// List flows
const flows = await client.flows.list()

// Create a flow
const flow = await client.flows.create({
  name: 'Product Scraper',
  url: 'https://example.com/products',
  mode: 'extract',
  description: 'Extract all product data',
})

// Run a flow
const run = await client.runs.trigger(flow.id)

// Get run results
const result = await client.runs.get(run.id)
console.log(result.outputPreview)

// One-shot extraction
const data = await client.extract({
  url: 'https://example.com/products',
  instructions: 'Get all product names and prices',
  schema: { name: 'string', price: 'number' },
})`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Python SDK</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b">
              <span className="text-xs font-medium text-muted-foreground">Python</span>
            </div>
            <pre className="bg-muted/50 p-4 overflow-x-auto">
              <code className="text-sm">{`from scraper_bot import ScraperBot

client = ScraperBot(api_key="scr_live_...")

# List flows
flows = client.flows.list()

# Create a flow
flow = client.flows.create(
    name="Product Scraper",
    url="https://example.com/products",
    mode="extract",
    description="Extract all product data",
)

# Run a flow
run = client.runs.trigger(flow.id)

# Get results
result = client.runs.get(run.id)
print(result.output_preview)

# One-shot extraction
data = client.extract(
    url="https://example.com/products",
    instructions="Get all product names and prices",
    schema={"name": "string", "price": "number"},
)`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">API Methods Reference</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
          <p className="mb-4">
            Both the TypeScript and Python SDKs expose the same methods. Python uses{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm">snake_case</code> for method
            parameters and response fields.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-semibold text-foreground">Method</th>
                  <th className="text-left py-3 font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.flows.list()</code></td>
                  <td className="py-3">List all flows</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.flows.get(id)</code></td>
                  <td className="py-3">Get a flow by ID</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.flows.create(data)</code></td>
                  <td className="py-3">Create a new flow</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.flows.update(id, data)</code></td>
                  <td className="py-3">Update an existing flow</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.flows.delete(id)</code></td>
                  <td className="py-3">Delete a flow</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.runs.list()</code></td>
                  <td className="py-3">List all runs</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.runs.trigger(flowId)</code></td>
                  <td className="py-3">Trigger a new run</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.runs.get(id)</code></td>
                  <td className="py-3">Get run details with results</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.extract(options)</code></td>
                  <td className="py-3">One-shot extraction without creating a flow</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.keys.list()</code></td>
                  <td className="py-3">List all API keys</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">client.keys.create(data)</code></td>
                  <td className="py-3">Create a new API key</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Error Handling</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Both SDKs throw typed exceptions for API errors. Catch these to handle rate limits,
            authentication failures, and validation errors gracefully.
          </p>

          <div className="rounded-lg border overflow-hidden mb-4">
            <div className="bg-muted px-4 py-2 border-b">
              <span className="text-xs font-medium text-muted-foreground">TypeScript</span>
            </div>
            <pre className="bg-muted/50 p-4 overflow-x-auto">
              <code className="text-sm">{`import { ScraperBot, ScraperBotError, RateLimitError } from '@scraper-bot/sdk'

const client = new ScraperBot({ apiKey: 'scr_live_...' })

try {
  const data = await client.extract({
    url: 'https://example.com',
    instructions: 'Get all headings',
  })
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(\`Rate limited. Retry after \${error.retryAfter}s\`)
  } else if (error instanceof ScraperBotError) {
    console.log(\`API error: \${error.message} (status \${error.status})\`)
  } else {
    throw error
  }
}`}</code>
            </pre>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b">
              <span className="text-xs font-medium text-muted-foreground">Python</span>
            </div>
            <pre className="bg-muted/50 p-4 overflow-x-auto">
              <code className="text-sm">{`from scraper_bot import ScraperBot, ScraperBotError, RateLimitError

client = ScraperBot(api_key="scr_live_...")

try:
    data = client.extract(
        url="https://example.com",
        instructions="Get all headings",
    )
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after}s")
except ScraperBotError as e:
    print(f"API error: {e.message} (status {e.status})")
except Exception as e:
    raise`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold mb-4">Rate Limits</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            API rate limits depend on your plan tier. When a limit is exceeded, the API returns a{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm">429 Too Many Requests</code>{" "}
            response with a <code className="bg-muted px-1.5 py-0.5 rounded text-sm">Retry-After</code>{" "}
            header. The SDK automatically retries with exponential backoff (up to 3 attempts).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-semibold text-foreground">Plan</th>
                  <th className="text-left py-3 pr-4 font-semibold text-foreground">Requests / min</th>
                  <th className="text-left py-3 pr-4 font-semibold text-foreground">Concurrent runs</th>
                  <th className="text-left py-3 font-semibold text-foreground">Monthly runs</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 pr-4 text-foreground font-medium">Free</td>
                  <td className="py-3 pr-4">30</td>
                  <td className="py-3 pr-4">1</td>
                  <td className="py-3">500</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 text-foreground font-medium">Pro</td>
                  <td className="py-3 pr-4">120</td>
                  <td className="py-3 pr-4">5</td>
                  <td className="py-3">10,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 text-foreground font-medium">Team</td>
                  <td className="py-3 pr-4">300</td>
                  <td className="py-3 pr-4">20</td>
                  <td className="py-3">50,000</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-foreground font-medium">Enterprise</td>
                  <td className="py-3 pr-4">Custom</td>
                  <td className="py-3 pr-4">Custom</td>
                  <td className="py-3">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            To increase your limits, upgrade your plan in{" "}
            <strong className="text-foreground">Settings &gt; Billing</strong> or contact the sales team
            for enterprise arrangements.
          </p>
        </div>
      </section>
    </div>
  )
}
