"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Play, Book, Clock, Search, ChevronDown, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const DEFAULT_QUERY = `query {
  flows(status: "active") {
    id
    name
    url
    mode
    status
    successRate
    totalRuns
    lastRunAt
  }
}`

const MOCK_FLOWS_RESPONSE = JSON.stringify(
  {
    data: {
      flows: [
        {
          id: "flow_a1b2c3d4",
          name: "Amazon Product Monitor",
          url: "https://www.amazon.com/s?k=wireless+headphones",
          mode: "monitor",
          status: "active",
          successRate: 98.5,
          totalRuns: 248,
          lastRunAt: "2026-03-18T12:00:00Z",
        },
        {
          id: "flow_e5f6g7h8",
          name: "HN Top Stories",
          url: "https://news.ycombinator.com",
          mode: "extract",
          status: "active",
          successRate: 99.2,
          totalRuns: 1024,
          lastRunAt: "2026-03-19T08:30:00Z",
        },
      ],
    },
  },
  null,
  2
)

const MOCK_RUNS_RESPONSE = JSON.stringify(
  {
    data: {
      runs: [
        {
          id: "run_x1y2z3",
          flowId: "flow_a1b2c3d4",
          status: "completed",
          startedAt: "2026-03-19T08:00:00Z",
          completedAt: "2026-03-19T08:00:12Z",
          duration: 12400,
          recordsExtracted: 47,
        },
        {
          id: "run_w4v5u6",
          flowId: "flow_e5f6g7h8",
          status: "completed",
          startedAt: "2026-03-19T07:00:00Z",
          completedAt: "2026-03-19T07:00:03Z",
          duration: 3200,
          recordsExtracted: 30,
        },
      ],
    },
  },
  null,
  2
)

const MOCK_DEFAULT_RESPONSE = JSON.stringify(
  {
    data: {
      __schema: {
        queryType: { name: "Query" },
        types: ["Query", "Flow", "Run", "ApiKey", "Alert"],
      },
    },
  },
  null,
  2
)

const SCHEMA_TYPES = [
  {
    name: "Query",
    fields: [
      { name: "flows", type: "[Flow!]!", args: "status: String" },
      { name: "flow", type: "Flow", args: "id: ID!" },
      { name: "runs", type: "[Run!]!", args: "flowId: ID, status: String" },
      { name: "run", type: "Run", args: "id: ID!" },
      { name: "apiKeys", type: "[ApiKey!]!" },
      { name: "alerts", type: "[Alert!]!", args: "flowId: ID" },
    ],
  },
  {
    name: "Flow",
    fields: [
      { name: "id", type: "ID!" },
      { name: "name", type: "String!" },
      { name: "url", type: "String!" },
      { name: "mode", type: "FlowMode!" },
      { name: "status", type: "FlowStatus!" },
      { name: "successRate", type: "Float" },
      { name: "totalRuns", type: "Int!" },
      { name: "lastRunAt", type: "DateTime" },
      { name: "createdAt", type: "DateTime!" },
      { name: "schedule", type: "String" },
    ],
  },
  {
    name: "Run",
    fields: [
      { name: "id", type: "ID!" },
      { name: "flowId", type: "ID!" },
      { name: "status", type: "RunStatus!" },
      { name: "startedAt", type: "DateTime!" },
      { name: "completedAt", type: "DateTime" },
      { name: "duration", type: "Int" },
      { name: "recordsExtracted", type: "Int" },
      { name: "error", type: "String" },
    ],
  },
  {
    name: "ApiKey",
    fields: [
      { name: "id", type: "ID!" },
      { name: "name", type: "String!" },
      { name: "prefix", type: "String!" },
      { name: "permissions", type: "[String!]!" },
      { name: "lastUsedAt", type: "DateTime" },
      { name: "createdAt", type: "DateTime!" },
    ],
  },
  {
    name: "Alert",
    fields: [
      { name: "id", type: "ID!" },
      { name: "flowId", type: "ID!" },
      { name: "type", type: "AlertType!" },
      { name: "message", type: "String!" },
      { name: "severity", type: "Severity!" },
      { name: "createdAt", type: "DateTime!" },
      { name: "acknowledged", type: "Boolean!" },
    ],
  },
]

function getResponseForQuery(query: string) {
  const lower = query.toLowerCase()
  if (lower.includes("runs")) return { response: MOCK_RUNS_RESPONSE, time: 38 }
  if (lower.includes("flow")) return { response: MOCK_FLOWS_RESPONSE, time: 45 }
  return { response: MOCK_DEFAULT_RESPONSE, time: 12 }
}

export default function GraphQLExplorerPage() {
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [variables, setVariables] = useState("{}")
  const [response, setResponse] = useState("")
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [showVariables, setShowVariables] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [docsSearch, setDocsSearch] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const runQuery = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setResponse("")
    setResponseTime(null)
    setStatusCode(null)

    const trimmed = query.trim()
    if (!trimmed) {
      toast.error("Query cannot be empty")
      setIsRunning(false)
      return
    }

    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((q) => q !== trimmed)].slice(0, 5)
      return next
    })

    setTimeout(() => {
      const result = getResponseForQuery(trimmed)
      setResponse(result.response)
      setResponseTime(result.time)
      setStatusCode(200)
      setIsRunning(false)
      toast.success("Query executed successfully")
    }, 300)
  }, [query, isRunning])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        runQuery()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [runQuery])

  const filteredTypes = docsSearch
    ? SCHEMA_TYPES.filter(
        (t) =>
          t.name.toLowerCase().includes(docsSearch.toLowerCase()) ||
          t.fields.some((f) => f.name.toLowerCase().includes(docsSearch.toLowerCase()))
      )
    : SCHEMA_TYPES

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">GraphQL Explorer</h1>
          <p className="text-sm text-muted-foreground">
            Query the Scraper.bot API using GraphQL
          </p>
        </div>
        <Button
          variant={showDocs ? "default" : "outline"}
          size="sm"
          onClick={() => setShowDocs(!showDocs)}
        >
          <Book className="mr-2 h-4 w-4" />
          Docs
        </Button>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className={cn("flex flex-1 min-h-0", showDocs ? "w-[calc(100%-320px)]" : "w-full")}>
          <div className="flex w-1/2 flex-col border-r">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Query
              </span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setShowHistory(!showHistory)}
                    disabled={history.length === 0}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    History ({history.length})
                  </Button>
                  {showHistory && history.length > 0 && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-md border bg-popover p-1 shadow-md">
                      {history.map((h, i) => (
                        <button
                          key={i}
                          className="w-full rounded px-3 py-2 text-left text-xs font-mono text-muted-foreground hover:bg-accent hover:text-foreground truncate"
                          onClick={() => {
                            setQuery(h)
                            setShowHistory(false)
                          }}
                        >
                          {h.slice(0, 80)}...
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-full w-full resize-none bg-zinc-950 p-4 font-mono text-sm text-zinc-100 focus:outline-none"
                spellCheck={false}
              />
            </div>
            <div className="border-t">
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setShowVariables(!showVariables)}
              >
                {showVariables ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                Variables
              </button>
              {showVariables && (
                <textarea
                  value={variables}
                  onChange={(e) => setVariables(e.target.value)}
                  className="h-24 w-full resize-none border-t bg-zinc-950 p-4 font-mono text-sm text-zinc-100 focus:outline-none"
                  placeholder='{ "key": "value" }'
                  spellCheck={false}
                />
              )}
            </div>
            <div className="flex items-center gap-3 border-t px-4 py-3">
              <Button
                onClick={runQuery}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRunning ? (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Run Query
              </Button>
              <span className="text-xs text-muted-foreground">
                {navigator.platform?.includes("Mac") ? "Cmd" : "Ctrl"}+Enter
              </span>
            </div>
          </div>

          <div className="flex w-1/2 flex-col">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Response
              </span>
              <div className="flex items-center gap-2">
                {statusCode !== null && (
                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/25">
                    {statusCode} OK
                  </Badge>
                )}
                {responseTime !== null && (
                  <Badge variant="outline" className="text-xs">
                    {responseTime}ms
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <pre className="h-full bg-zinc-950 p-4 font-mono text-sm text-zinc-100">
                {isRunning ? (
                  <span className="text-muted-foreground">Running query...</span>
                ) : response ? (
                  response
                ) : (
                  <span className="text-muted-foreground">
                    Click &quot;Run Query&quot; to execute
                  </span>
                )}
              </pre>
            </div>
          </div>
        </div>

        {showDocs && (
          <div className="w-80 shrink-0 border-l flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Schema Docs
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowDocs(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="px-4 py-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search types and fields..."
                  value={docsSearch}
                  onChange={(e) => setDocsSearch(e.target.value)}
                  className="w-full rounded-md border bg-background px-7 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {filteredTypes.map((type) => (
                <div key={type.name}>
                  <h3 className="font-mono text-sm font-semibold text-foreground mb-2">
                    {type.name}
                  </h3>
                  <div className="space-y-1">
                    {type.fields.map((field) => (
                      <div
                        key={field.name}
                        className="flex items-baseline justify-between rounded px-2 py-1 text-xs hover:bg-accent"
                      >
                        <span className="font-mono text-foreground">
                          {field.name}
                          {"args" in field && field.args && (
                            <span className="text-muted-foreground">
                              ({field.args})
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-muted-foreground ml-2 shrink-0">
                          {field.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
