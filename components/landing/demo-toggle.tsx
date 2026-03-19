"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot } from "lucide-react"

export function DemoToggle() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-background rounded-xl border border-border shadow-lg p-6 mb-6">
        <div className="flex gap-3">
          <Input
            placeholder="https://news.ycombinator.com"
            className="flex-1 h-12 text-base"
            readOnly
            defaultValue="https://news.ycombinator.com"
            aria-label="URL to scrape"
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6"
            onClick={() => setShowDemo((prev) => !prev)}
          >
            <Bot className="w-4 h-4 mr-2" />
            Extract
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3">Prompt: &quot;Get the top 5 story titles, URLs, and point counts&quot;</p>
      </div>

      {showDemo && (
        <div className="rounded-xl overflow-hidden border border-border shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between">
            <span className="text-zinc-400 text-sm font-mono">Response - 200 OK - 1.2s</span>
            <span className="text-xs text-green-400 font-mono">application/json</span>
          </div>
          <div className="bg-zinc-950 p-6 font-mono text-sm leading-relaxed">
            <p className="text-green-400">&#123;</p>
            <p className="text-green-400 pl-4">&quot;data&quot;: [</p>
            <p className="text-green-400 pl-8">&#123;</p>
            <p className="text-green-400 pl-12">&quot;title&quot;: &quot;Show HN: Open-source web scraping API&quot;,</p>
            <p className="text-green-400 pl-12">&quot;url&quot;: &quot;https://github.com/example/scraper&quot;,</p>
            <p className="text-green-400 pl-12">&quot;points&quot;: 342</p>
            <p className="text-green-400 pl-8">&#125;,</p>
            <p className="text-green-400 pl-8">&#123;</p>
            <p className="text-green-400 pl-12">&quot;title&quot;: &quot;Why deterministic scraping beats LLM-only&quot;,</p>
            <p className="text-green-400 pl-12">&quot;url&quot;: &quot;https://blog.example.com/deterministic&quot;,</p>
            <p className="text-green-400 pl-12">&quot;points&quot;: 287</p>
            <p className="text-green-400 pl-8">&#125;,</p>
            <p className="text-zinc-600 pl-8">{/* ... 3 more results */}</p>
            <p className="text-green-400 pl-4">],</p>
            <p className="text-green-400 pl-4">&quot;meta&quot;: &#123; &quot;total&quot;: 5, &quot;cached&quot;: false &#125;</p>
            <p className="text-green-400">&#125;</p>
          </div>
        </div>
      )}
    </div>
  )
}
