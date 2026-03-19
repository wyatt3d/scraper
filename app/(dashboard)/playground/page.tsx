"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Sparkles, User, Loader2, Globe, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "system"
  content: string
  timestamp: Date
}

interface ScrapeResponse {
  success: boolean
  url: string
  title: string
  items: Record<string, unknown>[]
  itemCount: number
  duration: number
  error?: string
}

export default function PlaygroundPage() {
  const [url, setUrl] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [outputData, setOutputData] = useState<Record<string, unknown>[] | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("output")
  const [scrapeMeta, setScrapeMeta] = useState<{ title: string; duration: number; url: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function addMessage(role: "user" | "system", content: string) {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, msg])
    return msg
  }

  async function handleAnalyze() {
    const targetUrl = url.trim()
    if (!targetUrl) return

    setIsAnalyzing(true)
    setMessages([])
    setOutputData(null)
    setScrapeMeta(null)

    addMessage("user", targetUrl)

    const analyzingId = `msg-${Date.now()}-analyzing`
    setMessages((prev) => [
      ...prev,
      {
        id: analyzingId,
        role: "system",
        content: `Scraping ${new URL(targetUrl).hostname}...`,
        timestamp: new Date(),
      },
    ])

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      })

      const data: ScrapeResponse & { error?: string } = await res.json()

      setMessages((prev) => prev.filter((m) => m.id !== analyzingId))

      if (!res.ok || !data.success) {
        addMessage("system", `Scrape failed: ${data.error || "Unknown error"}`)
        setIsAnalyzing(false)
        return
      }

      const fields = data.items.length > 0 ? Object.keys(data.items[0]) : []
      const fieldList = fields.length > 0 ? `\nFields: ${fields.join(", ")}` : ""

      addMessage(
        "system",
        `Found ${data.itemCount} items on "${data.title}" in ${data.duration}ms.${fieldList}\n\nCheck the Output tab for full results.`
      )

      setOutputData(data.items)
      setScrapeMeta({ title: data.title, duration: data.duration, url: data.url })
      setActiveTab("output")
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== analyzingId))
      const message = err instanceof Error ? err.message : "Request failed"
      addMessage("system", `Error: ${message}`)
    }

    setIsAnalyzing(false)
  }

  function handleSendMessage() {
    if (!inputValue.trim()) return
    const msg = inputValue.trim()
    addMessage("user", msg)
    setInputValue("")

    addMessage(
      "system",
      "Follow-up queries are not yet supported. Enter a new URL in the bar above to scrape another page."
    )
  }

  function handleCopy() {
    if (!outputData) return
    navigator.clipboard.writeText(JSON.stringify(outputData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inferredSchema =
    outputData && outputData.length > 0
      ? {
          type: "array",
          items: {
            type: "object",
            properties: Object.fromEntries(
              Object.entries(outputData[0]).map(([key, val]) => [
                key,
                { type: typeof val === "number" ? "number" : typeof val === "boolean" ? "boolean" : "string" },
              ])
            ),
          },
        }
      : null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Playground</h1>
        <p className="text-muted-foreground mt-1">
          Scrape any page — enter a URL and get structured data.
        </p>
      </div>

      <div className="flex h-[calc(100vh-220px)] gap-4">
        {/* Left: Chat */}
        <div className="flex w-[60%] flex-col rounded-lg border">
          {/* URL bar */}
          <div className="flex items-center gap-2 border-b p-3">
            <Globe className="text-muted-foreground size-4 shrink-0" />
            <Input
              placeholder="Enter a URL to scrape..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="border-0 shadow-none focus-visible:ring-0"
            />
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !url.trim()}
              size="sm"
              className="shrink-0 gap-1.5"
            >
              {isAnalyzing ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              Scrape
            </Button>
          </div>

          {/* Chat messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-20">
                <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                  <Sparkles className="text-muted-foreground size-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Enter a URL to get started</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Paste any webpage URL to extract structured data.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUrl("https://news.ycombinator.com")
                    setTimeout(handleAnalyze, 100)
                  }}
                  className="mt-2"
                >
                  Try example: news.ycombinator.com
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" && "justify-end"
                    )}
                  >
                    {msg.role === "system" && (
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Bot className="size-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-muted"
                      )}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full">
                        <User className="size-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isAnalyzing && (
                  <div className="flex gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Bot className="size-4" />
                    </div>
                    <div className="bg-muted flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm">
                      <Loader2 className="size-3.5 animate-spin" />
                      Scraping...
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Chat input */}
          <div className="flex items-center gap-2 border-t p-3">
            <Input
              ref={inputRef}
              placeholder={messages.length > 0 ? "Ask a follow-up question..." : "Scrape a URL first..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={messages.length === 0}
              className="border-0 shadow-none focus-visible:ring-0"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || messages.length === 0}
              className="size-8 shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>

        {/* Right: Results */}
        <div className="flex w-[40%] flex-col rounded-lg border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
            <div className="border-b px-3 pt-2">
              <TabsList className="h-9">
                <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
                <TabsTrigger value="schema" className="text-xs">Schema</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="output" className="mt-0 flex-1 overflow-hidden">
              {outputData ? (
                <div className="relative h-full">
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                    {scrapeMeta && (
                      <span className="text-muted-foreground text-[10px]">
                        {outputData.length} items | {scrapeMeta.duration}ms
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      className="size-7"
                    >
                      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    </Button>
                  </div>
                  <ScrollArea className="h-full">
                    <pre className="bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
                      <code>{JSON.stringify(outputData, null, 2)}</code>
                    </pre>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground text-sm">No output yet. Scrape a URL to see results.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="schema" className="mt-0 flex-1 overflow-hidden">
              {inferredSchema ? (
                <ScrollArea className="h-full">
                  <pre className="bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
                    <code>{JSON.stringify(inferredSchema, null, 2)}</code>
                  </pre>
                </ScrollArea>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground text-sm">No schema inferred yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
