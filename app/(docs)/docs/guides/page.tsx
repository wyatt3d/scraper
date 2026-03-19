import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Guides",
}

export default function GuidesPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">Guides</h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
        Practical, step-by-step walkthroughs for common scraping and automation tasks.
      </p>

      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-4">Scraping E-Commerce Product Data</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Extract product names, prices, images, and availability from an online store and set up
            daily monitoring to track changes over time.
          </p>

          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong className="text-foreground">Create a new Extract flow</strong> — In the dashboard,
              click <strong className="text-foreground">New Flow</strong> and select the{" "}
              <strong className="text-foreground">Extract</strong> mode.
            </li>
            <li>
              <strong className="text-foreground">Enter the store URL</strong> — Paste the product
              listing page URL (e.g.{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">https://store.example.com/products</code>).
            </li>
            <li>
              <strong className="text-foreground">Describe what to extract</strong> — In the description
              field, write: &quot;Extract all products with name, price, image URL, and stock status.&quot;
              Scraper&apos;s AI generates the extraction rules automatically.
            </li>
            <li>
              <strong className="text-foreground">Review the generated extraction rules</strong> — Verify
              the selectors and field mappings in the step editor. Adjust any selectors that target the
              wrong elements.
            </li>
            <li>
              <strong className="text-foreground">Run and verify output</strong> — Click{" "}
              <strong className="text-foreground">Run Now</strong> and inspect the extracted JSON in the
              run results panel.
            </li>
            <li>
              <strong className="text-foreground">Set up a schedule for daily price monitoring</strong> —
              Go to the flow&apos;s Schedule tab and set a cron expression like{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">0 8 * * *</code> to run every
              morning at 8 AM.
            </li>
          </ol>

          <p className="font-medium text-foreground mt-6 mb-2">Example output:</p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground">
{`[
  {
    "name": "Wireless Headphones Pro",
    "price": 79.99,
    "imageUrl": "https://store.example.com/images/headphones-pro.jpg",
    "inStock": true
  },
  {
    "name": "USB-C Charging Cable",
    "price": 12.49,
    "imageUrl": "https://store.example.com/images/usb-c-cable.jpg",
    "inStock": true
  },
  {
    "name": "Laptop Stand Adjustable",
    "price": 34.99,
    "imageUrl": "https://store.example.com/images/laptop-stand.jpg",
    "inStock": false
  }
]`}
          </pre>

          <div className="rounded-lg border border-blue-600/20 bg-blue-600/5 p-4 mt-6">
            <p className="font-medium text-foreground mb-2">Tips</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong className="text-foreground">Pagination</strong> — Use a Loop step with a
                &quot;Next Page&quot; click action to iterate through all result pages automatically.
              </li>
              <li>
                <strong className="text-foreground">Dynamic pricing</strong> — Some stores render prices
                via JavaScript. Scraper waits for the page to fully render before extracting, but you can
                add an explicit Wait step if prices load asynchronously.
              </li>
              <li>
                <strong className="text-foreground">Lazy-loaded images</strong> — Add a Scroll step before
                extraction to trigger lazy-loaded images. Set the scroll distance to cover the full product
                grid.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-4">Monitoring Prices and Getting Alerts</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Watch for price drops on specific products and get notified instantly through Slack, Discord,
            or email when a threshold is crossed.
          </p>

          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong className="text-foreground">Create a Monitor flow</strong> — Click{" "}
              <strong className="text-foreground">New Flow</strong> and select the{" "}
              <strong className="text-foreground">Monitor</strong> mode. This enables automatic change
              detection between runs.
            </li>
            <li>
              <strong className="text-foreground">Configure extraction for price fields</strong> — Add
              extraction rules targeting the price element. Use the{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">number</code> transform to strip
              currency symbols and parse the value.
            </li>
            <li>
              <strong className="text-foreground">Set a threshold alert</strong> — In the Alerts tab,
              create a threshold rule: &quot;Notify when{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">price</code> drops below $X.&quot;
              Choose the severity level (info, warning, or critical).
            </li>
            <li>
              <strong className="text-foreground">Connect a notification channel</strong> — Go to{" "}
              <strong className="text-foreground">Settings &gt; Notifications</strong> and add your Slack
              webhook URL, Discord webhook, or email address.
            </li>
            <li>
              <strong className="text-foreground">Set the schedule</strong> — Configure the flow to run
              every 6 hours with the cron expression{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">0 */6 * * *</code>.
            </li>
          </ol>

          <p className="font-medium text-foreground mt-6 mb-2">Example alert configuration:</p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground">
{`{
  "alerts": [
    {
      "type": "threshold",
      "field": "price",
      "operator": "lt",
      "value": 50,
      "severity": "critical",
      "message": "Price dropped below $50!"
    },
    {
      "type": "change_detected",
      "field": "inStock",
      "severity": "warning",
      "message": "Stock status changed"
    }
  ],
  "notifications": {
    "slack": "https://hooks.slack.com/services/T.../B.../xxx",
    "email": "alerts@yourcompany.com"
  },
  "schedule": "0 */6 * * *"
}`}
          </pre>

          <div className="rounded-lg border border-blue-600/20 bg-blue-600/5 p-4 mt-6">
            <p className="font-medium text-foreground mb-2">Tips</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong className="text-foreground">Avoiding false positives</strong> — Use the{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm">number</code> transform to
                normalize prices before comparison. This prevents alerts caused by formatting changes
                (e.g. &quot;$49.99&quot; vs &quot;49.99 USD&quot;).
              </li>
              <li>
                <strong className="text-foreground">Meaningful thresholds</strong> — Set thresholds based
                on actual price history rather than arbitrary values. Review the first few runs to
                establish a baseline before configuring alerts.
              </li>
              <li>
                <strong className="text-foreground">Multiple channels</strong> — Route critical alerts to
                Slack for immediate attention and info-level alerts to email for daily digests.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold mb-4">Automating Form Submissions</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Automate filling and submitting web forms such as contact forms, applications, or search
            queries using the Interact flow mode.
          </p>

          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong className="text-foreground">Create an Interact flow</strong> — Select the{" "}
              <strong className="text-foreground">Interact</strong> mode when creating a new flow. This
              mode supports browser actions like clicking, typing, and navigating.
            </li>
            <li>
              <strong className="text-foreground">Map form fields using selectors</strong> — Add Fill
              steps for each form field. Use CSS selectors like{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">input[name=&quot;email&quot;]</code>{" "}
              or{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">#contact-form textarea</code> to
              target the right elements.
            </li>
            <li>
              <strong className="text-foreground">Use variables for dynamic data</strong> — Reference
              variables in your Fill values using double curly braces:{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{"{{name}}"}</code>,{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{"{{email}}"}</code>,{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{"{{message}}"}</code>. Variables
              are passed in when triggering the run via API.
            </li>
            <li>
              <strong className="text-foreground">Add a confirmation extraction step</strong> — After
              submitting, add an Extract step to capture the confirmation message or reference number.
              This verifies the submission succeeded.
            </li>
            <li>
              <strong className="text-foreground">Handle multi-page forms with Condition steps</strong> —
              Use Condition steps to check which page you are on and branch your flow logic accordingly.
              Add Click and Wait steps between form pages.
            </li>
          </ol>

          <p className="font-medium text-foreground mt-6 mb-2">Example flow definition:</p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground">
{`{
  "name": "Contact Form Submission",
  "mode": "interact",
  "url": "https://example.com/contact",
  "steps": [
    { "type": "fill", "selector": "input[name='name']", "value": "{{name}}" },
    { "type": "fill", "selector": "input[name='email']", "value": "{{email}}" },
    { "type": "fill", "selector": "textarea[name='message']", "value": "{{message}}" },
    { "type": "click", "selector": "button[type='submit']" },
    { "type": "wait", "selector": ".confirmation", "timeout": 5000 },
    {
      "type": "extract",
      "selector": ".confirmation",
      "fields": ["referenceNumber", "statusMessage"]
    }
  ],
  "variables": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "I'd like to learn more about your services."
  }
}`}
          </pre>

          <div className="rounded-lg border border-blue-600/20 bg-blue-600/5 p-4 mt-6">
            <p className="font-medium text-foreground mb-2">Tips</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong className="text-foreground">CAPTCHAs</strong> — Scraper cannot solve CAPTCHAs
                automatically. For forms protected by CAPTCHAs, consider using the API provider&apos;s
                direct submission endpoint instead, or use a CAPTCHA-solving integration.
              </li>
              <li>
                <strong className="text-foreground">File uploads</strong> — Use the Upload step type to
                attach files to file input fields. Provide a URL to the file or a base64-encoded string.
              </li>
              <li>
                <strong className="text-foreground">Multi-step forms</strong> — For wizard-style forms,
                chain Fill and Click steps for each page. Add Wait steps between pages to ensure the next
                form section has loaded before filling it.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
