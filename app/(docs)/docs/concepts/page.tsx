import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Concepts",
}

export default function ConceptsPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">Concepts</h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
        Core abstractions and building blocks of the Scraper platform.
      </p>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Flows</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            A Flow is the core unit of work in Scraper. It defines what to scrape or automate and
            how. Every Flow operates in one of three modes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Extract</strong> — Pull structured data from a
              webpage. Define the fields you need, point it at a URL, and receive clean JSON.
            </li>
            <li>
              <strong className="text-foreground">Interact</strong> — Automate browser actions like
              logging in, submitting forms, clicking through paginated results, or downloading files.
            </li>
            <li>
              <strong className="text-foreground">Monitor</strong> — Watch a page for changes over
              time. Scraper compares outputs across runs and alerts you when something differs.
            </li>
          </ul>
          <p>
            Flows contain ordered steps, output schemas, and optional schedules. They are versioned,
            so you can roll back to a previous configuration at any time. Flows can also be exported
            and imported as JSON, making it easy to share configurations across teams or environments.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground">
{`{
  "name": "HN Top Stories",
  "mode": "extract",
  "url": "https://news.ycombinator.com",
  "steps": [...],
  "schema": {
    "title": "string",
    "url": "string",
    "points": "number"
  },
  "schedule": "0 */6 * * *"
}`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Steps</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Steps are the individual actions within a Flow. They execute sequentially and define the
            exact browser operations Scraper performs during a run. Each step has a type and
            associated configuration.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Navigate</strong> — Go to a URL. Supports dynamic
              URLs with variable interpolation.
            </li>
            <li>
              <strong className="text-foreground">Click</strong> — Click an element by CSS selector
              or AI-mapped target.
            </li>
            <li>
              <strong className="text-foreground">Fill</strong> — Enter text into a form field.
              Supports input, textarea, and contenteditable elements.
            </li>
            <li>
              <strong className="text-foreground">Extract</strong> — Pull structured data from the
              current page using selectors and extraction rules.
            </li>
            <li>
              <strong className="text-foreground">Wait</strong> — Pause execution until an element
              appears, a timeout elapses, or a network request completes.
            </li>
            <li>
              <strong className="text-foreground">Scroll</strong> — Scroll the page to trigger lazy
              loading or infinite scroll content.
            </li>
            <li>
              <strong className="text-foreground">Screenshot</strong> — Capture the current page
              state as a PNG. Useful for debugging or visual verification.
            </li>
            <li>
              <strong className="text-foreground">Condition</strong> — Branch based on element
              presence, text content, or extracted values.
            </li>
            <li>
              <strong className="text-foreground">Loop</strong> — Repeat a set of steps for
              pagination, list iteration, or retry logic.
            </li>
          </ul>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground">
{`{
  "type": "loop",
  "selector": ".next-page",
  "maxIterations": 10,
  "steps": [
    { "type": "extract", "selector": ".product-card", "fields": ["name", "price"] },
    { "type": "click", "selector": ".next-page" },
    { "type": "wait", "timeout": 2000 }
  ]
}`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Runs</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            A Run is a single execution of a Flow. Every time a Flow is triggered — manually, via
            API, on a schedule, or by a webhook — it creates a Run. Runs track everything that
            happens during execution.
          </p>
          <p>Each run has a status:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Queued</strong> — The run is waiting for an
              available worker.
            </li>
            <li>
              <strong className="text-foreground">Running</strong> — The flow is actively executing
              steps.
            </li>
            <li>
              <strong className="text-foreground">Completed</strong> — All steps finished
              successfully and data was extracted.
            </li>
            <li>
              <strong className="text-foreground">Failed</strong> — An error occurred. Logs contain
              the failure reason and the step that caused it.
            </li>
            <li>
              <strong className="text-foreground">Cancelled</strong> — The run was manually stopped
              before completion.
            </li>
          </ul>
          <p>
            Every run produces detailed logs, extracted data (if applicable), total duration, and
            cost metrics. Runs can be triggered manually from the dashboard, via the REST API, on a
            cron schedule, or in response to an incoming webhook.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Extraction Rules</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Extraction Rules define how raw page content gets transformed into structured data. They
            map CSS selectors to output fields and apply transformations to normalize the results.
          </p>
          <p>
            Each rule consists of a selector, a target field name, and an optional transform. The
            available transform types are:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">text</strong> — Extract the visible text content
              of the element.
            </li>
            <li>
              <strong className="text-foreground">html</strong> — Extract the inner HTML.
            </li>
            <li>
              <strong className="text-foreground">number</strong> — Parse the text as a number,
              stripping currency symbols and commas.
            </li>
            <li>
              <strong className="text-foreground">date</strong> — Parse the text as an ISO 8601
              date string.
            </li>
            <li>
              <strong className="text-foreground">url</strong> — Resolve relative URLs to absolute
              URLs.
            </li>
          </ul>
          <p>
            Output schemas define the shape of the final extracted data. Each field in the schema
            corresponds to an extraction rule. When a run completes, the extracted data is validated
            against the schema before being stored or delivered.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground">
{`{
  "rules": [
    { "selector": "h1.title", "field": "title", "transform": "text" },
    { "selector": ".price", "field": "price", "transform": "number" },
    { "selector": "time[datetime]", "field": "publishedAt", "transform": "date" },
    { "selector": "a.product-link", "field": "link", "transform": "url" }
  ]
}`}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Monitoring & Alerts</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Monitoring flows automatically compare extracted data across runs to detect changes.
            When a difference is found, Scraper generates an alert and delivers it through your
            configured notification channels.
          </p>
          <p>Alert types:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">change_detected</strong> — A monitored field has
              changed since the last run.
            </li>
            <li>
              <strong className="text-foreground">threshold</strong> — A numeric field crossed a
              defined threshold (e.g., price dropped below $50).
            </li>
            <li>
              <strong className="text-foreground">error</strong> — A scheduled run failed.
            </li>
            <li>
              <strong className="text-foreground">schedule_missed</strong> — A scheduled run did
              not execute within its expected window.
            </li>
          </ul>
          <p>Each alert has a severity level:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">info</strong> — Informational, no action needed.
            </li>
            <li>
              <strong className="text-foreground">warning</strong> — Something may need attention.
            </li>
            <li>
              <strong className="text-foreground">critical</strong> — Immediate action recommended.
            </li>
          </ul>
          <p>
            Notifications can be delivered via email, Slack, Discord, or any custom webhook endpoint.
            You can configure different channels for different severity levels.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold mb-4">API & Integration</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Every feature in Scraper is accessible programmatically through the REST API. All
            requests are authenticated with API keys that you generate from the dashboard.
          </p>
          <p>
            Each Flow gets a unique API endpoint. You can trigger runs, retrieve extracted data,
            and manage flow configuration entirely through the API without ever touching the
            dashboard.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground">
{`# Trigger a flow run
curl -X POST https://api.scraper.bot/v1/flows/f_3kx9m2/run \\
  -H "Authorization: Bearer scr_live_..." \\
  -H "Content-Type: application/json"

# Get run results
curl https://api.scraper.bot/v1/runs/r_8jx2k1 \\
  -H "Authorization: Bearer scr_live_..."`}
          </pre>
          <p>
            Official SDKs are available for TypeScript and Python, providing typed clients with
            built-in retry logic and error handling.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground">
{`import { Scraper } from "@scraper/sdk"

const scraper = new Scraper({ apiKey: "scr_live_..." })

const run = await scraper.flows.run("f_3kx9m2")
const data = await run.waitForCompletion()

console.log(data.results)`}
          </pre>
          <p>
            Webhooks allow Scraper to push data to your systems in real time. Configure a webhook
            URL on any flow, and Scraper will POST the extracted data to your endpoint as soon as a
            run completes. Webhook triggers also let you start runs from external systems by sending
            a POST request to a unique trigger URL.
          </p>
        </div>
      </section>
    </div>
  )
}
