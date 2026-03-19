import type { Metadata } from "next"
import { CTABanner } from "@/components/docs/cta-banner"

export const metadata: Metadata = {
  title: "Quickstart Guide",
}

export default function QuickstartPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">Quickstart</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Get your first scraping flow running in under 5 minutes.
      </p>

      <div className="space-y-12">
        <Step number={1} title="Create your account">
          <p className="text-muted-foreground mb-4">
            Sign up at <code className="bg-muted px-1.5 py-0.5 rounded text-sm">scraper.bot/sign-up</code> to
            get access to the dashboard. Free tier includes 500 runs per month.
          </p>
        </Step>

        <Step number={2} title="Create your first Flow">
          <p className="text-muted-foreground mb-4">
            Navigate to <strong>Flows</strong> in the dashboard sidebar and click <strong>New Flow</strong>.
            Choose a template or start from scratch. Define your target URL, extraction selectors,
            and output schema.
          </p>
          <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center text-sm text-muted-foreground">
            Screenshot: Flow builder interface
          </div>
        </Step>

        <Step number={3} title="Run the flow">
          <p className="text-muted-foreground mb-4">
            Click <strong>Run Now</strong> to execute your flow immediately. Watch the real-time
            logs as Scraper navigates to your target URL, executes each step, and extracts data.
          </p>
        </Step>

        <Step number={4} title="Get your API endpoint">
          <p className="text-muted-foreground mb-4">
            Every flow gets a unique API endpoint. Go to <strong>Settings &gt; API Keys</strong> to
            generate a key, then use the endpoint to trigger runs programmatically.
          </p>
          <CodeBlock
            title="Your flow endpoint"
            code="https://scraper.bot/api/flows/flow-abc123/run"
          />
        </Step>

        <Step number={5} title="Integrate">
          <p className="text-muted-foreground mb-6">
            Trigger your flow from any language or tool. Here are examples for common platforms:
          </p>

          <div className="space-y-4">
            <CodeBlock
              title="curl"
              code={`curl -X POST https://scraper.bot/api/flows/flow-abc123/run \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json"`}
            />

            <CodeBlock
              title="JavaScript (fetch)"
              code={`const response = await fetch(
  "https://scraper.bot/api/flows/flow-abc123/run",
  {
    method: "POST",
    headers: {
      "X-API-Key": "scr_live_your_key_here",
      "Content-Type": "application/json",
    },
  }
);

const { data } = await response.json();
console.log(data.id); // run-xyz789`}
            />

            <CodeBlock
              title="Python (requests)"
              code={`import requests

response = requests.post(
    "https://scraper.bot/api/flows/flow-abc123/run",
    headers={
        "X-API-Key": "scr_live_your_key_here",
        "Content-Type": "application/json",
    },
)

data = response.json()["data"]
print(data["id"])  # run-xyz789`}
            />
          </div>
        </Step>
      </div>

      <CTABanner />
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {number}
        </span>
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
      </div>
      <div className="ml-11">{children}</div>
    </div>
  )
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
      </div>
      <pre className="bg-muted/50 p-4 overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  )
}
