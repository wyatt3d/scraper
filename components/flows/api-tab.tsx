"use client"

import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface ApiTabProps {
  flowId: string
  flowName: string
}

export function ApiTab({ flowId, flowName }: ApiTabProps) {
  const endpoint = `https://scraper.bot/api/flows/${flowId}/run`
  const curlExample = `curl -X POST "${endpoint}" \\
  -H "Authorization: Bearer scr_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "webhook": "https://your-site.com/webhook",
    "format": "json"
  }'`

  const jsExample = `import { Scraper } from '@scraper/sdk';

const scraper = new Scraper('scr_live_your_api_key');

const run = await scraper.flows.run('${flowId}', {
  webhook: 'https://your-site.com/webhook',
  format: 'json',
});

console.log(run.id); // run_xxxxxxxxxxxxx`

  const pythonExample = `from scraper import Scraper

client = Scraper(api_key="scr_live_your_api_key")

run = client.flows.run(
    flow_id="${flowId}",
    webhook="https://your-site.com/webhook",
    format="json",
)

print(run.id)  # run_xxxxxxxxxxxxx`

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-[family-name:var(--font-crimson-text)] text-xl font-semibold">
            API Access
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Trigger &quot;{flowName}&quot; programmatically via the REST API or SDK.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
              <Badge className="bg-green-600 hover:bg-green-600 text-xs shrink-0">POST</Badge>
              <code className="font-mono text-sm truncate">{endpoint}</code>
              <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto shrink-0" aria-label="Copy to clipboard">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">cURL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="rounded-md bg-zinc-950 p-4 text-xs text-zinc-100 overflow-x-auto">
                <code>{curlExample}</code>
              </pre>
              <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7 text-zinc-400 hover:text-zinc-100" aria-label="Copy to clipboard">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">JavaScript / TypeScript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="rounded-md bg-zinc-950 p-4 text-xs text-zinc-100 overflow-x-auto">
                <code>{jsExample}</code>
              </pre>
              <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7 text-zinc-400 hover:text-zinc-100" aria-label="Copy to clipboard">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Python</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="rounded-md bg-zinc-950 p-4 text-xs text-zinc-100 overflow-x-auto">
                <code>{pythonExample}</code>
              </pre>
              <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7 text-zinc-400 hover:text-zinc-100" aria-label="Copy to clipboard">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
