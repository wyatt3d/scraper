"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "bot" | "user"
  text: string
}

const quickReplies = [
  "How does it work?",
  "Pricing info",
  "Talk to sales",
  "Get support",
] as const

const quickReplyResponses: Record<string, string> = {
  "How does it work?":
    "Scraper.bot turns any website into a structured API. Just describe what data you need, and our AI builds an extraction flow. You get a REST API endpoint in minutes.",
  "Pricing info":
    "We offer a Free tier (100 runs/mo), Pro at $29/mo (5,000 runs), and Enterprise with custom pricing. Visit scraper.bot/pricing for full details.",
  "Talk to sales":
    "I'd be happy to connect you with our sales team! Email sales@scraper.bot or schedule a call at scraper.bot/contact.",
  "Get support":
    "Check our docs at scraper.bot/docs for quickstart guides, or post in our community forum at scraper.bot/community. For urgent issues, email support@scraper.bot.",
}

const defaultResponse =
  "Thanks for your message! A team member will follow up shortly. In the meantime, check out our docs at scraper.bot/docs."

const PUBLIC_PATHS = [
  "/",
  "/pricing",
  "/status",
  "/changelog",
  "/extension",
]

const PUBLIC_PREFIXES = [
  "/docs",
  "/blog",
  "/community",
]

function isPublicPage(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I'm the Scraper.bot assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!isPublicPage(pathname)) return null

  function addMessages(userText: string, botText: string) {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "bot", text: botText },
    ])
  }

  function handleQuickReply(reply: string) {
    setShowQuickReplies(false)
    addMessages(reply, quickReplyResponses[reply])
  }

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput("")
    setShowQuickReplies(false)
    addMessages(text, defaultResponse)
  }

  return (
    <>
      {open && (
        <div className="fixed right-6 bottom-22 z-50 flex flex-col w-80 h-96 rounded-2xl shadow-2xl border border-border bg-background overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Chat with us</span>
              <span className="size-2 rounded-full bg-green-400" />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover:opacity-80 transition-opacity"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm animate-in slide-in-from-bottom-2 fade-in duration-200",
                  msg.role === "bot"
                    ? "bg-muted text-foreground self-start"
                    : "bg-blue-600 text-white self-end ml-auto"
                )}
              >
                {msg.text}
              </div>
            ))}
            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="rounded-full border border-blue-600 text-blue-600 px-3 py-1 text-xs hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 border-t border-border px-3 py-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-40"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed right-6 bottom-6 z-50 size-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        aria-label="Open chat"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  )
}
