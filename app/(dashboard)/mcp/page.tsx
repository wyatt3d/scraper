"use client"

import { useState } from "react"
import {
  Check,
  Circle,
  Copy,
  Cpu,
  Eye,
  EyeOff,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

const MCP_ENDPOINT = "https://api.scraper.bot/mcp"
const MASKED_KEY = "scr_live_****************************a7f2"
const FULL_KEY = "scr_live_k8x2m4n6p9q1r3s5t7u0v2w4y6z8a7f2"

const availableTools = [
  { name: "scrape_url", description: "Extract data from any URL", params: "url, instructions, schema" },
  { name: "list_flows", description: "List all saved flows", params: "limit, offset, status" },
  { name: "run_flow", description: "Execute a saved flow", params: "flow_id, parameters" },
  { name: "get_run", description: "Get run results", params: "run_id" },
  { name: "create_flow", description: "Create a new flow", params: "name, url, mode, steps" },
  { name: "monitor_url", description: "Set up change monitoring", params: "url, selector, interval" },
]

const recentCalls = [
  { id: 1, timestamp: "2026-03-19 14:32:01", tool: "scrape_url", status: "success", duration: "1.2s" },
  { id: 2, timestamp: "2026-03-19 14:28:45", tool: "list_flows", status: "success", duration: "0.3s" },
  { id: 3, timestamp: "2026-03-19 14:15:12", tool: "run_flow", status: "success", duration: "4.8s" },
  { id: 4, timestamp: "2026-03-19 13:58:33", tool: "get_run", status: "success", duration: "0.2s" },
  { id: 5, timestamp: "2026-03-19 13:42:07", tool: "scrape_url", status: "error", duration: "2.1s" },
]

const claudeConfig = `{
  "mcpServers": {
    "scraper-bot": {
      "command": "npx",
      "args": ["-y", "@scraper-bot/mcp-server"],
      "env": { "SCRAPER_API_KEY": "scr_live_..." }
    }
  }
}`

const cursorConfig = `{
  "mcpServers": {
    "scraper-bot": {
      "command": "npx",
      "args": ["-y", "@scraper-bot/mcp-server"],
      "env": { "SCRAPER_API_KEY": "scr_live_..." }
    }
  }
}`

const customConfig = `SSE Endpoint: https://api.scraper.bot/mcp/sse

Headers:
  Authorization: Bearer scr_live_...
  Content-Type: application/json

POST https://api.scraper.bot/mcp/messages
  { "method": "tools/call", "params": { "name": "scrape_url", "arguments": { "url": "..." } } }`

export default function McpPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [keyRevealed, setKeyRevealed] = useState(false)

  function copyText(text: string, id: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight flex items-center gap-3">
            MCP Server
            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/15">
              <Circle className="size-2 fill-emerald-500 text-emerald-500 mr-1" />
              Connected
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect Scraper.bot to AI assistants like Claude Code, Cursor, and Windsurf via the Model Context Protocol
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connection Config</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">MCP Endpoint URL</label>
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
              <code className="flex-1 text-sm font-mono">{MCP_ENDPOINT}</code>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                onClick={() => copyText(MCP_ENDPOINT, "endpoint", "Endpoint URL")}
              >
                {copiedId === "endpoint" ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
              <code className="flex-1 text-sm font-mono text-muted-foreground">
                {keyRevealed ? FULL_KEY : MASKED_KEY}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                onClick={() => setKeyRevealed(!keyRevealed)}
              >
                {keyRevealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                onClick={() => copyText(FULL_KEY, "api-key", "API key")}
              >
                {copiedId === "api-key" ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Circle className="size-2.5 fill-emerald-500 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Connected</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Setup Instructions</CardTitle>
          <CardDescription>Configure your AI assistant to connect to Scraper.bot</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="claude-code">
            <TabsList>
              <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
              <TabsTrigger value="cursor">Cursor</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="claude-code" className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add this to your <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">claude_desktop_config.json</code> or project MCP settings:
              </p>
              <div className="relative">
                <pre className="rounded-md border bg-muted/50 p-4 text-sm font-mono overflow-x-auto">
                  {claudeConfig}
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 size-8"
                  onClick={() => copyText(claudeConfig, "claude-config", "Claude Code config")}
                >
                  {copiedId === "claude-config" ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="cursor" className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add this to <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">.cursor/mcp.json</code> in your project root:
              </p>
              <div className="relative">
                <pre className="rounded-md border bg-muted/50 p-4 text-sm font-mono overflow-x-auto">
                  {cursorConfig}
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 size-8"
                  onClick={() => copyText(cursorConfig, "cursor-config", "Cursor config")}
                >
                  {copiedId === "cursor-config" ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="custom" className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Connect via HTTP SSE for any MCP-compatible client:
              </p>
              <div className="relative">
                <pre className="rounded-md border bg-muted/50 p-4 text-sm font-mono overflow-x-auto">
                  {customConfig}
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 size-8"
                  onClick={() => copyText(customConfig, "custom-config", "Custom config")}
                >
                  {copiedId === "custom-config" ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Tools</CardTitle>
          <CardDescription>Tools exposed to AI assistants via the MCP protocol</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Parameters</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableTools.map((tool) => (
                <TableRow key={tool.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Cpu className="size-4 text-muted-foreground" />
                      <code className="text-sm font-mono font-medium">{tool.name}</code>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{tool.description}</TableCell>
                  <TableCell>
                    <code className="text-xs font-mono text-muted-foreground">{tool.params}</code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent MCP Calls</CardTitle>
          <CardDescription>Last 5 tool invocations from connected AI assistants</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Tool</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {call.timestamp}
                  </TableCell>
                  <TableCell>
                    <code className="text-sm font-mono">{call.tool}</code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={call.status === "success" ? "default" : "destructive"}
                      className={
                        call.status === "success"
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/15"
                          : ""
                      }
                    >
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{call.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
