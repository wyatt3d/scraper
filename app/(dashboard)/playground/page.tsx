"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Sparkles, User, Loader2, Globe, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "system"
  content: string
  timestamp: Date
  typing?: boolean
}

const mockOutputData = [
  { name: "Wireless Headphones Pro", price: 79.99, image: "/products/headphones.jpg", inStock: true },
  { name: "USB-C Hub 7-in-1", price: 34.99, image: "/products/hub.jpg", inStock: true },
  { name: "Mechanical Keyboard RGB", price: 129.99, image: "/products/keyboard.jpg", inStock: true },
  { name: "4K Webcam Ultra", price: 89.99, image: "/products/webcam.jpg", inStock: false },
  { name: "Laptop Stand Adjustable", price: 44.99, image: "/products/stand.jpg", inStock: true },
  { name: "Wireless Mouse Ergonomic", price: 29.99, image: "/products/mouse.jpg", inStock: true },
  { name: "Monitor Light Bar", price: 54.99, image: "/products/lightbar.jpg", inStock: true },
  { name: "Desk Mat XXL", price: 24.99, image: "/products/deskmat.jpg", inStock: true },
  { name: "Cable Management Kit", price: 19.99, image: "/products/cables.jpg", inStock: true },
  { name: "USB Microphone Studio", price: 69.99, image: "/products/mic.jpg", inStock: false },
  { name: "Portable SSD 1TB", price: 94.99, image: "/products/ssd.jpg", inStock: true },
  { name: "Bluetooth Speaker Mini", price: 39.99, image: "/products/speaker.jpg", inStock: true },
  { name: "Smart Power Strip", price: 32.99, image: "/products/powerstrip.jpg", inStock: true },
  { name: "Noise Cancelling Earbuds", price: 59.99, image: "/products/earbuds.jpg", inStock: true },
  { name: "Webcam Privacy Cover", price: 9.99, image: "/products/cover.jpg", inStock: true },
  { name: "HDMI Cable 6ft", price: 12.99, image: "/products/hdmi.jpg", inStock: true },
  { name: "Screen Cleaning Kit", price: 14.99, image: "/products/cleaning.jpg", inStock: true },
  { name: "Phone Stand Magnetic", price: 22.99, image: "/products/phonestand.jpg", inStock: true },
  { name: "USB Flash Drive 128GB", price: 15.99, image: "/products/flashdrive.jpg", inStock: true },
  { name: "Ethernet Adapter USB-C", price: 18.99, image: "/products/ethernet.jpg", inStock: true },
  { name: "Wireless Charger Pad", price: 27.99, image: "/products/charger.jpg", inStock: false },
  { name: "Keyboard Wrist Rest", price: 16.99, image: "/products/wristrest.jpg", inStock: true },
  { name: "Mini Display Hub", price: 49.99, image: "/products/displayhub.jpg", inStock: true },
  { name: "Anti-Glare Screen Film", price: 11.99, image: "/products/film.jpg", inStock: true },
]

const mockSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string", description: "Product name" },
      price: { type: "number", description: "Price in USD" },
      image: { type: "string", description: "Product image path" },
      inStock: { type: "boolean", description: "Availability status" },
    },
    required: ["name", "price"],
  },
}

const preloadedFlow: { url: string; messages: Omit<ChatMessage, "id" | "timestamp">[] } = {
  url: "https://example-store.com/products",
  messages: [
    { role: "system", content: "Analyzing page structure at example-store.com/products..." },
    { role: "system", content: "Found 24 products with prices, titles, images, and stock status. The page uses a grid layout with pagination.\n\nDetected fields:\n- Product name (.product-title)\n- Price (.price)\n- Image (.product-img src)\n- Availability (.stock-badge)\n\nWhat would you like to extract?" },
    { role: "user", content: "Get all product names and prices" },
    { role: "system", content: "Generating extraction flow...\n\nSteps:\n1. Navigate to product listing\n2. Extract name, price from each .product-card\n3. Paginate through all pages\n\nDone! Extracted 24 items. Check the Output tab for results." },
  ],
}

export default function PlaygroundPage() {
  const [url, setUrl] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasOutput, setHasOutput] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("output")
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
    if (!url.trim()) return
    setIsAnalyzing(true)
    setMessages([])
    setHasOutput(false)

    await delay(300)
    addMessage("user", url.trim())

    await delay(800)
    for (const msg of preloadedFlow.messages) {
      await delay(msg.role === "system" ? 1200 : 400)
      addMessage(msg.role, msg.content)
    }

    setHasOutput(true)
    setActiveTab("output")
    setIsAnalyzing(false)
  }

  function handleSendMessage() {
    if (!inputValue.trim()) return
    const msg = inputValue.trim()
    addMessage("user", msg)
    setInputValue("")

    const lower = msg.toLowerCase()
    let response: string

    if (/price|cost|amount|\$/.test(lower)) {
      response = "To extract pricing fields, I added a `price` selector targeting `.price`, `.product-price`, and `[data-price]` elements. The values are automatically parsed to numbers with currency symbols stripped. You can filter by price range in a follow-up step."
    } else if (/paginate|next page|pagination|page\s?\d/.test(lower)) {
      response = "I detected pagination on this page using `.pagination a.next` selectors. The flow will automatically click through all pages and aggregate results. Set a max page limit in the flow config to control depth. Currently configured for up to 10 pages."
    } else if (/schedule|cron|recurring|automat/.test(lower)) {
      response = "You can schedule this flow to run automatically. Go to the Flows page and set a cron expression — e.g. `0 */6 * * *` for every 6 hours. Results will be delivered to your configured webhook or saved to your output destination each run."
    } else {
      response = "Got it. I can refine the extraction or add more fields. Try asking me to filter by price range, handle pagination across multiple pages, or schedule this flow to run automatically."
    }

    setTimeout(() => {
      addMessage("system", response)
    }, 1000)
  }

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(mockOutputData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Playground</h1>
        <p className="text-muted-foreground mt-1">
          Interactively scrape any page with AI assistance.
        </p>
      </div>

      <div className="flex h-[calc(100vh-220px)] gap-4">
        {/* Left: Chat */}
        <div className="flex w-[60%] flex-col rounded-lg border">
          {/* URL bar */}
          <div className="flex items-center gap-2 border-b p-3">
            <Globe className="text-muted-foreground size-4 shrink-0" />
            <Input
              placeholder="Enter a URL to analyze..."
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
              Analyze
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
                    Paste any webpage URL and the AI will analyze its structure.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUrl("https://example-store.com/products")
                    setTimeout(handleAnalyze, 100)
                  }}
                  className="mt-2"
                >
                  Try example: example-store.com/products
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
                      Analyzing...
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
              placeholder={messages.length > 0 ? "Ask a follow-up question..." : "Analyze a URL first..."}
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
                <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
                <TabsTrigger value="schema" className="text-xs">Schema</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="output" className="mt-0 flex-1 overflow-hidden">
              {hasOutput ? (
                <div className="relative h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="absolute top-2 right-2 z-10 size-7"
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  </Button>
                  <ScrollArea className="h-full">
                    <pre className="bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
                      <code>{JSON.stringify(mockOutputData, null, 2)}</code>
                    </pre>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground text-sm">No output yet. Analyze a URL to see results.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="mt-0 flex-1 overflow-hidden">
              {hasOutput ? (
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-2 gap-3 p-4">
                    {mockOutputData.slice(0, 12).map((item) => (
                      <div key={item.name} className="rounded-lg border p-3 space-y-1.5">
                        <div className="bg-muted flex h-20 items-center justify-center rounded text-xs text-muted-foreground">
                          Image
                        </div>
                        <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">${item.price}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              item.inStock
                                ? "border-emerald-500/25 text-emerald-600"
                                : "border-red-500/25 text-red-500"
                            )}
                          >
                            {item.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground text-sm">No preview available yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="schema" className="mt-0 flex-1 overflow-hidden">
              {hasOutput ? (
                <ScrollArea className="h-full">
                  <pre className="bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
                    <code>{JSON.stringify(mockSchema, null, 2)}</code>
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
