"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  Send,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { mockFlows, mockRuns } from "@/lib/mock-data"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
  POST: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
  PUT: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/25",
  DELETE: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/25",
}

const ENDPOINTS = [
  { path: "/flows", methods: ["GET", "POST"] },
  { path: "/flows/{id}", methods: ["GET", "PUT", "DELETE"] },
  { path: "/runs", methods: ["GET", "POST"] },
  { path: "/runs/{id}", methods: ["GET"] },
  { path: "/extract", methods: ["POST"] },
  { path: "/keys", methods: ["GET"] },
] as const

const EXAMPLE_BODIES: Record<string, string> = {
  "POST /flows": JSON.stringify(
    {
      name: "My Scraper",
      url: "https://example.com",
      mode: "extract",
      description: "Extract product data",
    },
    null,
    2
  ),
  "POST /runs": JSON.stringify({ flowId: "flow-1" }, null, 2),
  "POST /extract": JSON.stringify(
    {
      url: "https://example.com/products",
      instructions: "Get all product names and prices",
    },
    null,
    2
  ),
}

function getMockResponse(method: HttpMethod, path: string) {
  if (method === "GET" && path === "/flows") {
    return {
      status: 200,
      statusText: "OK",
      time: 245,
      size: "3.8 KB",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req_abc123def456",
        "x-ratelimit-remaining": "4982",
        "x-ratelimit-limit": "5000",
      },
      body: {
        data: mockFlows.map((f) => ({
          id: f.id,
          name: f.name,
          url: f.url,
          mode: f.mode,
          status: f.status,
          totalRuns: f.totalRuns,
          successRate: f.successRate,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
        })),
        total: mockFlows.length,
        page: 1,
        perPage: 25,
      },
    }
  }
  if (method === "GET" && path === "/flows/{id}") {
    const f = mockFlows[0]
    return {
      status: 200,
      statusText: "OK",
      time: 128,
      size: "1.2 KB",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req_xyz789ghi012",
      },
      body: {
        id: f.id,
        name: f.name,
        description: f.description,
        url: f.url,
        mode: f.mode,
        status: f.status,
        steps: f.steps,
        outputSchema: f.outputSchema,
        schedule: f.schedule,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      },
    }
  }
  if (method === "POST" && path === "/flows") {
    return {
      status: 201,
      statusText: "Created",
      time: 312,
      size: "0.6 KB",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req_new123flow",
        location: "/v1/flows/flow-new-1",
      },
      body: {
        id: "flow-new-1",
        name: "My Scraper",
        url: "https://example.com",
        mode: "extract",
        description: "Extract product data",
        status: "draft",
        createdAt: "2026-03-18T18:30:00Z",
      },
    }
  }
  if (method === "GET" && path === "/runs") {
    return {
      status: 200,
      statusText: "OK",
      time: 189,
      size: "2.4 KB",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req_runs456list",
      },
      body: {
        data: mockRuns.map((r) => ({
          id: r.id,
          flowId: r.flowId,
          flowName: r.flowName,
          status: r.status,
          startedAt: r.startedAt,
          duration: r.duration,
          itemsExtracted: r.itemsExtracted,
          cost: r.cost,
        })),
        total: mockRuns.length,
        page: 1,
        perPage: 25,
      },
    }
  }
  if (method === "GET" && path === "/runs/{id}") {
    const r = mockRuns[0]
    return {
      status: 200,
      statusText: "OK",
      time: 95,
      size: "1.8 KB",
      headers: { "content-type": "application/json", "x-request-id": "req_run789detail" },
      body: r,
    }
  }
  if (method === "POST" && path === "/runs") {
    return {
      status: 201,
      statusText: "Created",
      time: 423,
      size: "0.4 KB",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req_trigrun001",
        location: "/v1/runs/run-new-1",
      },
      body: {
        id: "run-new-1",
        flowId: "flow-1",
        status: "queued",
        startedAt: "2026-03-18T18:30:00Z",
        message: "Run queued successfully",
      },
    }
  }
  if (method === "POST" && path === "/extract") {
    return {
      status: 200,
      statusText: "OK",
      time: 1842,
      size: "1.6 KB",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req_ext456abc",
        "x-credits-used": "3",
      },
      body: {
        data: [
          { name: "Wireless Mouse", price: 29.99 },
          { name: "USB-C Adapter", price: 14.99 },
          { name: "Laptop Stand", price: 49.99 },
          { name: "Webcam HD 1080p", price: 59.99 },
          { name: "Keyboard Wrist Rest", price: 19.99 },
        ],
        url: "https://example.com/products",
        extractedAt: "2026-03-18T18:30:00Z",
        credits: 3,
      },
    }
  }
  if (method === "GET" && path === "/keys") {
    return {
      status: 200,
      statusText: "OK",
      time: 67,
      size: "0.8 KB",
      headers: { "content-type": "application/json", "x-request-id": "req_keys789" },
      body: {
        data: [
          { id: "key-1", name: "Production API Key", prefix: "scr_live_", createdAt: "2026-01-15T10:00:00Z", scopes: ["flows:read", "flows:write", "runs:read", "runs:write"] },
          { id: "key-2", name: "Development Key", prefix: "scr_test_", createdAt: "2026-02-20T14:00:00Z", scopes: ["flows:read", "runs:read"] },
        ],
      },
    }
  }
  if (method === "PUT" && path === "/flows/{id}") {
    return {
      status: 200,
      statusText: "OK",
      time: 198,
      size: "0.5 KB",
      headers: { "content-type": "application/json", "x-request-id": "req_upd123" },
      body: { id: "flow-1", name: "Updated Flow", status: "active", updatedAt: "2026-03-18T18:30:00Z" },
    }
  }
  if (method === "DELETE" && path === "/flows/{id}") {
    return {
      status: 204,
      statusText: "No Content",
      time: 112,
      size: "0 B",
      headers: { "x-request-id": "req_del789" },
      body: null,
    }
  }
  return {
    status: 404,
    statusText: "Not Found",
    time: 45,
    size: "0.1 KB",
    headers: { "content-type": "application/json" },
    body: { error: "Endpoint not found" },
  }
}

function statusColor(status: number) {
  if (status >= 200 && status < 300) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
  if (status >= 400 && status < 500) return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/25"
  return "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/25"
}

function syntaxHighlight(json: string) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-orange-400"
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "text-blue-400" : "text-emerald-400"
      } else if (/true|false/.test(match)) {
        cls = "text-purple-400"
      } else if (/null/.test(match)) {
        cls = "text-zinc-500"
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

export default function ApiPlaygroundPage() {
  const [method, setMethod] = useState<HttpMethod>("GET")
  const [selectedPath, setSelectedPath] = useState("/flows")
  const [url, setUrl] = useState("https://api.scraper.bot/v1/flows")
  const [apiKey, setApiKey] = useState("scr_live_your_key_here")
  const [body, setBody] = useState("")
  const [headersOpen, setHeadersOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ReturnType<typeof getMockResponse> | null>(null)
  const [copied, setCopied] = useState(false)

  function handlePathChange(path: string) {
    setSelectedPath(path)
    setUrl(`https://api.scraper.bot/v1${path}`)
    const endpoint = ENDPOINTS.find((e) => e.path === path)
    if (endpoint) {
      const validMethods = endpoint.methods as readonly string[]
      if (!validMethods.includes(method)) {
        setMethod(validMethods[0] as HttpMethod)
      }
    }
    const bodyKey = `${method} ${path}`
    if (EXAMPLE_BODIES[bodyKey]) {
      setBody(EXAMPLE_BODIES[bodyKey])
    } else {
      const postKey = `POST ${path}`
      if (EXAMPLE_BODIES[postKey] && (method === "POST" || method === "PUT")) {
        setBody(EXAMPLE_BODIES[postKey])
      } else {
        setBody("")
      }
    }
  }

  function handleMethodChange(m: string) {
    setMethod(m as HttpMethod)
    const bodyKey = `${m} ${selectedPath}`
    if (EXAMPLE_BODIES[bodyKey]) {
      setBody(EXAMPLE_BODIES[bodyKey])
    } else if (m === "GET" || m === "DELETE") {
      setBody("")
    }
  }

  function handleSend() {
    setLoading(true)
    setResponse(null)
    setTimeout(() => {
      setResponse(getMockResponse(method, selectedPath))
      setLoading(false)
    }, 800)
  }

  function generateCurl() {
    let curl = `curl -X ${method} '${url}'`
    curl += ` \\\n  -H 'X-API-Key: ${apiKey}'`
    curl += ` \\\n  -H 'Content-Type: application/json'`
    if ((method === "POST" || method === "PUT") && body.trim()) {
      curl += ` \\\n  -d '${body.replace(/\n/g, "").replace(/\s{2,}/g, " ")}'`
    }
    return curl
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const showBody = method === "POST" || method === "PUT"
  const currentEndpoint = ENDPOINTS.find((e) => e.path === selectedPath)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            API Playground
          </h1>
          <p className="text-muted-foreground mt-1">
            Test API endpoints interactively. Explore requests and responses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-3">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Request
              </Label>
              <div className="flex gap-2">
                <Select value={method} onValueChange={handleMethodChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue>
                      <Badge variant="outline" className={cn("font-mono text-xs", METHOD_COLORS[method])}>
                        {method}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(currentEndpoint?.methods ?? ["GET", "POST", "PUT", "DELETE"]).map((m) => (
                      <SelectItem key={m} value={m}>
                        <Badge variant="outline" className={cn("font-mono text-xs", METHOD_COLORS[m as HttpMethod])}>
                          {m}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Endpoint
              </Label>
              <Select value={selectedPath} onValueChange={handlePathChange}>
                <SelectTrigger className="w-full font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENDPOINTS.map((ep) => (
                    <SelectItem key={ep.path} value={ep.path} className="font-mono text-sm">
                      {ep.path}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {(ep.methods as readonly string[]).join(", ")}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setHeadersOpen(!headersOpen)}
                className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {headersOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                Headers
              </button>
              {headersOpen && (
                <div className="space-y-2 rounded-md border p-3 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground w-28 shrink-0">X-API-Key</span>
                    <Input
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="font-mono text-xs h-8"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground w-28 shrink-0">Content-Type</span>
                    <Input
                      value="application/json"
                      readOnly
                      className="font-mono text-xs h-8 opacity-60"
                    />
                  </div>
                </div>
              )}
            </div>

            {showBody && (
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Body
                </Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[160px] font-mono text-sm bg-zinc-950 text-zinc-100 dark:bg-zinc-950 border-zinc-800"
                  placeholder='{ "key": "value" }'
                />
              </div>
            )}

            <Button
              onClick={handleSend}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Send Request
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {!loading && !response && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Send className="size-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Send a request to see the response
                </p>
              </div>
            )}

            {!loading && response && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn("font-mono text-xs", statusColor(response.status))}>
                    {response.status} {response.statusText}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{response.time}ms</span>
                  <span className="text-xs text-muted-foreground">{response.size}</span>
                </div>

                <Tabs defaultValue="response">
                  <TabsList>
                    <TabsTrigger value="response">Response</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="response">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 size-7 z-10"
                        onClick={() => copyText(response.body ? JSON.stringify(response.body, null, 2) : "")}
                      >
                        {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                      </Button>
                      <pre className="rounded-md bg-zinc-950 p-4 text-xs font-mono overflow-auto max-h-[420px] border border-zinc-800">
                        {response.body ? (
                          <code
                            dangerouslySetInnerHTML={{
                              __html: syntaxHighlight(JSON.stringify(response.body, null, 2)),
                            }}
                          />
                        ) : (
                          <code className="text-zinc-500">No content</code>
                        )}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="headers">
                    <div className="rounded-md border bg-muted/30 divide-y">
                      {Object.entries(response.headers).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-3 px-3 py-2">
                          <span className="text-xs font-mono font-medium text-blue-500 w-48 shrink-0">{key}</span>
                          <span className="text-xs font-mono text-muted-foreground">{val}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="curl">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 size-7 z-10"
                        onClick={() => copyText(generateCurl())}
                      >
                        {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                      </Button>
                      <pre className="rounded-md bg-zinc-950 p-4 text-xs font-mono overflow-auto max-h-[420px] text-zinc-300 border border-zinc-800 whitespace-pre-wrap">
                        {generateCurl()}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" size="sm" className="gap-1.5" asChild>
          <Link href="/docs/api-reference">
            <ExternalLink className="size-3.5" />
            API Documentation
          </Link>
        </Button>
      </div>
    </div>
  )
}
