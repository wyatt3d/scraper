import type { Metadata } from "next"
import { CTABanner } from "@/components/docs/cta-banner"

export const metadata: Metadata = {
  title: "API Reference",
}

export default function ApiReferencePage() {
  return (
    <div>
      <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">API Reference</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Complete reference for the Scraper REST API. All endpoints require authentication
        via API key.
      </p>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Authentication</h2>
        <p className="text-muted-foreground mb-4">
          Include your API key in the <code className="bg-muted px-1.5 py-0.5 rounded text-sm">X-API-Key</code> header
          with every request. Generate keys from the dashboard under <strong>Settings &gt; API Keys</strong>.
        </p>
        <CodeBlock
          title="Header"
          code={`X-API-Key: scr_live_your_key_here`}
        />
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Base URL</h2>
        <CodeBlock title="" code="https://scraper.bot/api" />
      </section>

      <div className="space-y-16">
        <Endpoint
          method="GET"
          path="/flows"
          description="List all flows. Supports filtering by status and mode."
          params={[
            { name: "status", type: "string", description: "Filter by flow status: active, paused, draft, error", required: false },
            { name: "mode", type: "string", description: "Filter by flow mode: extract, interact, monitor", required: false },
          ]}
          responseExample={`{
  "data": [
    {
      "id": "flow-1",
      "name": "Product Price Monitor",
      "status": "active",
      "mode": "monitor",
      "url": "https://example-store.com/products",
      "successRate": 98.5,
      "totalRuns": 248,
      "createdAt": "2026-02-15T10:00:00Z"
    }
  ],
  "total": 6
}`}
          curlExample={`curl https://scraper.bot/api/flows?status=active \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/flows?status=active", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="POST"
          path="/flows"
          description="Create a new flow."
          body={`{
  "name": "My New Flow",
  "description": "Scrape product listings",
  "url": "https://example.com/products",
  "mode": "extract",
  "steps": [
    { "type": "navigate", "label": "Go to page" },
    { "type": "extract", "label": "Extract data" }
  ],
  "outputSchema": { "title": "string", "price": "number" }
}`}
          responseExample={`{
  "data": {
    "id": "flow-1710000000000",
    "name": "My New Flow",
    "status": "draft",
    "createdAt": "2026-03-18T12:00:00Z"
  }
}`}
          curlExample={`curl -X POST https://scraper.bot/api/flows \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"My New Flow","url":"https://example.com","mode":"extract"}'`}
          jsExample={`const res = await fetch("/api/flows", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "My New Flow",
    url: "https://example.com",
    mode: "extract",
  }),
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="GET"
          path="/flows/:id"
          description="Get a single flow by ID."
          responseExample={`{
  "data": {
    "id": "flow-1",
    "name": "Product Price Monitor",
    "description": "Track prices across e-commerce sites",
    "url": "https://example-store.com/products",
    "mode": "monitor",
    "status": "active",
    "steps": [...],
    "outputSchema": { "name": "string", "price": "number" },
    "successRate": 98.5,
    "totalRuns": 248
  }
}`}
          curlExample={`curl https://scraper.bot/api/flows/flow-1 \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/flows/flow-1", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="PUT"
          path="/flows/:id"
          description="Update an existing flow. Merge-patches the provided fields."
          body={`{
  "name": "Updated Flow Name",
  "status": "active"
}`}
          responseExample={`{
  "data": {
    "id": "flow-1",
    "name": "Updated Flow Name",
    "status": "active",
    "updatedAt": "2026-03-18T12:00:00Z"
  }
}`}
          curlExample={`curl -X PUT https://scraper.bot/api/flows/flow-1 \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Updated Flow Name","status":"active"}'`}
          jsExample={`const res = await fetch("/api/flows/flow-1", {
  method: "PUT",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Updated Flow Name" }),
});`}
        />

        <Endpoint
          method="DELETE"
          path="/flows/:id"
          description="Delete a flow by ID."
          responseExample={`{
  "message": "Flow flow-1 deleted successfully"
}`}
          curlExample={`curl -X DELETE https://scraper.bot/api/flows/flow-1 \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`await fetch("/api/flows/flow-1", {
  method: "DELETE",
  headers: { "X-API-Key": "scr_live_your_key_here" },
});`}
        />

        <Endpoint
          method="GET"
          path="/runs"
          description="List all runs. Supports filtering by flow ID and status."
          params={[
            { name: "flowId", type: "string", description: "Filter runs by flow ID", required: false },
            { name: "status", type: "string", description: "Filter by run status: queued, running, completed, failed, cancelled", required: false },
          ]}
          responseExample={`{
  "data": [
    {
      "id": "run-1",
      "flowId": "flow-1",
      "flowName": "Product Price Monitor",
      "status": "completed",
      "startedAt": "2026-03-18T12:00:00Z",
      "duration": 12400,
      "itemsExtracted": 147,
      "cost": 0.003
    }
  ],
  "total": 5
}`}
          curlExample={`curl https://scraper.bot/api/runs?flowId=flow-1&status=completed \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/runs?flowId=flow-1", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="POST"
          path="/runs"
          description="Trigger a new run for a flow. The run starts in queued status."
          body={`{
  "flowId": "flow-1"
}`}
          responseExample={`{
  "data": {
    "id": "run-1710000000000",
    "flowId": "flow-1",
    "flowName": "Product Price Monitor",
    "status": "queued",
    "startedAt": "2026-03-18T12:00:00Z",
    "cost": 0
  }
}`}
          curlExample={`curl -X POST https://scraper.bot/api/runs \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"flowId":"flow-1"}'`}
          jsExample={`const res = await fetch("/api/runs", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ flowId: "flow-1" }),
});`}
        />

        <Endpoint
          method="GET"
          path="/runs/:id"
          description="Get a single run by ID, including full logs."
          responseExample={`{
  "data": {
    "id": "run-1",
    "flowId": "flow-1",
    "status": "completed",
    "duration": 12400,
    "itemsExtracted": 147,
    "logs": [
      { "timestamp": "...", "level": "info", "message": "Run started" },
      { "timestamp": "...", "level": "info", "message": "Extracted 147 items" }
    ],
    "outputPreview": [...]
  }
}`}
          curlExample={`curl https://scraper.bot/api/runs/run-1 \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/runs/run-1", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();
console.log(data.logs);`}
        />

        <Endpoint
          method="POST"
          path="/extract"
          description="One-shot extraction. Send a URL and optional instructions to get structured data back instantly without creating a flow."
          body={`{
  "url": "https://example-store.com/products",
  "instructions": "Extract all product names and prices",
  "schema": {
    "name": "string",
    "price": "number"
  }
}`}
          responseExample={`{
  "data": {
    "url": "https://example-store.com/products",
    "extractedAt": "2026-03-18T12:00:00Z",
    "itemCount": 3,
    "items": [
      { "name": "Wireless Headphones Pro", "price": 79.99 },
      { "name": "USB-C Hub 7-in-1", "price": 34.99 },
      { "name": "Mechanical Keyboard", "price": 129.99 }
    ]
  }
}`}
          curlExample={`curl -X POST https://scraper.bot/api/extract \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example-store.com/products","instructions":"Extract all product names and prices"}'`}
          jsExample={`const res = await fetch("/api/extract", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example-store.com/products",
    instructions: "Extract all product names and prices",
    schema: { name: "string", price: "number" },
  }),
});
const { data } = await res.json();
console.log(data.items);`}
        />

        <Endpoint
          method="GET"
          path="/keys"
          description="List all API keys. Keys are returned masked for security."
          responseExample={`{
  "data": [
    {
      "id": "key-1",
      "name": "Production API Key",
      "key": "scr_live_****xxxx",
      "createdAt": "2026-01-15T10:00:00Z",
      "scopes": ["flows:read", "flows:write", "runs:read", "runs:write"]
    }
  ],
  "total": 3
}`}
          curlExample={`curl https://scraper.bot/api/keys \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/keys", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="POST"
          path="/keys"
          description="Create a new API key. The full key is only returned once on creation."
          body={`{
  "name": "My New Key",
  "scopes": ["flows:read", "runs:read", "runs:write"]
}`}
          responseExample={`{
  "data": {
    "id": "key-1710000000000",
    "name": "My New Key",
    "key": "scr_live_abc123def456...",
    "createdAt": "2026-03-18T12:00:00Z",
    "scopes": ["flows:read", "runs:read", "runs:write"]
  }
}`}
          curlExample={`curl -X POST https://scraper.bot/api/keys \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"My New Key","scopes":["flows:read","runs:read"]}'`}
          jsExample={`const res = await fetch("/api/keys", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "My New Key",
    scopes: ["flows:read", "runs:read"],
  }),
});
const { data } = await res.json();
// Save data.key - it won't be shown again`}
        />
        <Endpoint
          method="POST"
          path="/runs/trigger"
          description="Trigger a run for a flow by flow ID. Alias for POST /runs with additional trigger metadata."
          body={`{
  "flowId": "flow-1",
  "trigger": "api"
}`}
          responseExample={`{
  "data": {
    "id": "run-1710000000000",
    "flowId": "flow-1",
    "status": "queued",
    "trigger": "api",
    "startedAt": "2026-03-19T12:00:00Z"
  }
}`}
          curlExample={`curl -X POST https://scraper.bot/api/runs/trigger \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"flowId":"flow-1","trigger":"api"}'`}
          jsExample={`const res = await fetch("/api/runs/trigger", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ flowId: "flow-1", trigger: "api" }),
});`}
        />

        <Endpoint
          method="POST"
          path="/generate"
          description="Generate a complete scraping flow from a natural language description using Claude AI."
          body={`{
  "prompt": "Scrape all product names and prices from this e-commerce page",
  "url": "https://example-store.com/products"
}`}
          responseExample={`{
  "data": {
    "name": "Product Price Scraper",
    "description": "Extract product names and prices",
    "url": "https://example-store.com/products",
    "mode": "extract",
    "steps": [
      { "type": "navigate", "url": "https://example-store.com/products" },
      { "type": "extract", "selector": ".product-card", "fields": ["name", "price"] }
    ],
    "outputSchema": { "name": "string", "price": "number" }
  }
}`}
          curlExample={`curl -X POST https://scraper.bot/api/generate \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt":"Scrape all product names and prices","url":"https://example-store.com/products"}'`}
          jsExample={`const res = await fetch("/api/generate", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Scrape all product names and prices",
    url: "https://example-store.com/products",
  }),
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="GET"
          path="/alerts"
          description="List all alerts. Supports filtering by severity and read status."
          params={[
            { name: "severity", type: "string", description: "Filter by severity: info, warning, critical", required: false },
            { name: "read", type: "boolean", description: "Filter by read status", required: false },
          ]}
          responseExample={`{
  "data": [
    {
      "id": "alert-1",
      "type": "change_detected",
      "severity": "warning",
      "flowId": "flow-1",
      "message": "Price changed from $29.99 to $24.99",
      "read": false,
      "createdAt": "2026-03-19T08:00:00Z"
    }
  ],
  "total": 3
}`}
          curlExample={`curl https://scraper.bot/api/alerts?severity=warning \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/alerts?severity=warning", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="GET"
          path="/analytics"
          description="Retrieve usage analytics including run counts, success rates, and cost breakdown over a time range."
          params={[
            { name: "period", type: "string", description: "Time period: 7d, 30d, 90d", required: false },
          ]}
          responseExample={`{
  "data": {
    "totalRuns": 1247,
    "successRate": 96.8,
    "totalCost": 12.47,
    "dataPointsExtracted": 48230,
    "dailyBreakdown": [
      { "date": "2026-03-19", "runs": 42, "success": 41, "cost": 0.42 }
    ]
  }
}`}
          curlExample={`curl https://scraper.bot/api/analytics?period=30d \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/analytics?period=30d", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="GET"
          path="/audit"
          description="Retrieve the audit log of all actions performed on the account."
          params={[
            { name: "limit", type: "number", description: "Number of entries to return (default 50)", required: false },
          ]}
          responseExample={`{
  "data": [
    {
      "id": "audit-1",
      "action": "flow.created",
      "userId": "user-1",
      "resource": "flow-1",
      "timestamp": "2026-03-19T10:00:00Z",
      "metadata": { "name": "Product Scraper" }
    }
  ],
  "total": 128
}`}
          curlExample={`curl https://scraper.bot/api/audit?limit=20 \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/audit?limit=20", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="POST"
          path="/checkout"
          description="Create a Stripe checkout session for plan upgrades. Redirects the user to Stripe for payment."
          body={`{
  "plan": "pro",
  "interval": "monthly"
}`}
          responseExample={`{
  "url": "https://checkout.stripe.com/c/pay/cs_live_...",
  "sessionId": "cs_live_..."
}`}
          curlExample={`curl -X POST https://scraper.bot/api/checkout \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"plan":"pro","interval":"monthly"}'`}
          jsExample={`const res = await fetch("/api/checkout", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ plan: "pro", interval: "monthly" }),
});
const { url } = await res.json();
window.location.href = url;`}
        />

        <Endpoint
          method="POST"
          path="/email"
          description="Send a transactional email via Resend. Used internally for alerts, reports, and welcome emails."
          body={`{
  "to": "user@example.com",
  "subject": "Your scraping report is ready",
  "template": "report_ready",
  "data": { "flowName": "Product Monitor", "itemCount": 147 }
}`}
          responseExample={`{
  "id": "msg_1710000000000",
  "status": "sent"
}`}
          curlExample={`curl -X POST https://scraper.bot/api/email \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"to":"user@example.com","subject":"Report ready","template":"report_ready"}'`}
          jsExample={`const res = await fetch("/api/email", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: "user@example.com",
    subject: "Report ready",
    template: "report_ready",
  }),
});`}
        />

        <Endpoint
          method="GET"
          path="/health"
          description="Health check endpoint. Returns the current status of all platform services."
          responseExample={`{
  "status": "healthy",
  "services": {
    "api": "up",
    "database": "up",
    "scraping_engine": "up",
    "ai": "up"
  },
  "version": "0.6.0",
  "uptime": 864000
}`}
          curlExample={`curl https://scraper.bot/api/health`}
          jsExample={`const res = await fetch("/api/health");
const { status, services } = await res.json();`}
        />

        <Endpoint
          method="POST"
          path="/screenshot"
          description="Capture a screenshot of any URL using the Browserless Chrome engine."
          body={`{
  "url": "https://example.com",
  "fullPage": true,
  "width": 1280
}`}
          responseExample={`{
  "data": {
    "url": "https://example.com",
    "screenshotUrl": "https://storage.scraper.bot/screenshots/scr_1710000000.png",
    "width": 1280,
    "height": 2400,
    "capturedAt": "2026-03-19T12:00:00Z"
  }
}`}
          curlExample={`curl -X POST https://scraper.bot/api/screenshot \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com","fullPage":true}'`}
          jsExample={`const res = await fetch("/api/screenshot", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: "https://example.com", fullPage: true }),
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="POST"
          path="/tickets"
          description="Submit a trouble ticket or bug report. Supports visual bug reports with element selectors."
          body={`{
  "subject": "Flow fails on login page",
  "description": "The flow times out when trying to click the login button",
  "type": "bug",
  "priority": "high",
  "flowId": "flow-1",
  "screenshot": "data:image/png;base64,..."
}`}
          responseExample={`{
  "data": {
    "id": "ticket-1710000000000",
    "subject": "Flow fails on login page",
    "status": "open",
    "priority": "high",
    "createdAt": "2026-03-19T12:00:00Z"
  }
}`}
          curlExample={`curl -X POST https://scraper.bot/api/tickets \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"subject":"Flow fails on login page","type":"bug","priority":"high"}'`}
          jsExample={`const res = await fetch("/api/tickets", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    subject: "Flow fails on login page",
    type: "bug",
    priority: "high",
  }),
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="GET"
          path="/activity"
          description="Retrieve the recent activity feed for the authenticated user."
          params={[
            { name: "limit", type: "number", description: "Number of entries (default 20)", required: false },
          ]}
          responseExample={`{
  "data": [
    {
      "id": "act-1",
      "type": "run.completed",
      "message": "Product Monitor completed successfully",
      "flowId": "flow-1",
      "timestamp": "2026-03-19T11:30:00Z"
    }
  ],
  "total": 45
}`}
          curlExample={`curl https://scraper.bot/api/activity?limit=10 \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/activity?limit=10", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="GET"
          path="/webhooks"
          description="List all configured webhooks for the authenticated user."
          responseExample={`{
  "data": [
    {
      "id": "wh-1",
      "url": "https://example.com/webhook",
      "events": ["run.completed", "alert.created"],
      "active": true,
      "createdAt": "2026-03-10T10:00:00Z"
    }
  ],
  "total": 2
}`}
          curlExample={`curl https://scraper.bot/api/webhooks \\
  -H "X-API-Key: scr_live_your_key_here"`}
          jsExample={`const res = await fetch("/api/webhooks", {
  headers: { "X-API-Key": "scr_live_your_key_here" },
});
const { data } = await res.json();`}
        />

        <Endpoint
          method="POST"
          path="/webhooks"
          description="Create a new webhook endpoint to receive event notifications."
          body={`{
  "url": "https://example.com/webhook",
  "events": ["run.completed", "run.failed", "alert.created"],
  "secret": "whsec_your_signing_secret"
}`}
          responseExample={`{
  "data": {
    "id": "wh-1710000000000",
    "url": "https://example.com/webhook",
    "events": ["run.completed", "run.failed", "alert.created"],
    "active": true,
    "createdAt": "2026-03-19T12:00:00Z"
  }
}`}
          curlExample={`curl -X POST https://scraper.bot/api/webhooks \\
  -H "X-API-Key: scr_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/webhook","events":["run.completed"]}'`}
          jsExample={`const res = await fetch("/api/webhooks", {
  method: "POST",
  headers: {
    "X-API-Key": "scr_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com/webhook",
    events: ["run.completed", "run.failed"],
  }),
});
const { data } = await res.json();`}
        />
      </div>

      <CTABanner title="Ready to integrate?" buttonText="Get Your API Key" buttonHref="/api-keys" />
    </div>
  )
}

function Endpoint({
  method,
  path,
  description,
  params,
  body,
  responseExample,
  curlExample,
  jsExample,
}: {
  method: string
  path: string
  description: string
  params?: { name: string; type: string; description: string; required: boolean }[]
  body?: string
  responseExample: string
  curlExample: string
  jsExample: string
}) {
  const methodColors: Record<string, string> = {
    GET: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    POST: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    PUT: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-2">
        <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[method] ?? ""}`}>
          {method}
        </span>
        <code className="text-sm font-semibold">{path}</code>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>

      {params && params.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Query Parameters</h4>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-4 py-2 font-medium">Name</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {params.map((p) => (
                  <tr key={p.name} className="border-t">
                    <td className="px-4 py-2">
                      <code className="text-sm">{p.name}</code>
                      {p.required && <span className="ml-1 text-red-500 text-xs">*</span>}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{p.type}</td>
                    <td className="px-4 py-2 text-muted-foreground">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {body && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Request Body</h4>
          <CodeBlock title="JSON" code={body} />
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">Response</h4>
        <CodeBlock title="JSON" code={responseExample} />
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Examples</h4>
        <CodeBlock title="curl" code={curlExample} />
        <CodeBlock title="JavaScript" code={jsExample} />
      </div>
    </section>
  )
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      {title && (
        <div className="bg-muted px-4 py-2 border-b">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
        </div>
      )}
      <pre className="bg-muted/50 p-4 overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  )
}
