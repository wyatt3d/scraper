"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, Flag, CheckCircle2, MessageSquare, Bold, Italic, Code, LinkIcon, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Reply {
  id: string
  author: { name: string; initials: string }
  date: string
  body: string
  likes: number
  staff?: boolean
  bestAnswer?: boolean
  nested?: Reply
}

interface ThreadData {
  id: string
  title: string
  category: string
  categoryStyle: string
  author: { name: string; initials: string }
  date: string
  tags: string[]
  body: string
  likes: number
  views: number
  staff?: boolean
  replies: Reply[]
}

const threads: Record<string, ThreadData> = {
  "paginated-ecommerce": {
    id: "paginated-ecommerce",
    title: "How to scrape a paginated e-commerce site?",
    category: "Help & Support",
    categoryStyle: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    author: { name: "Alex Chen", initials: "AC" },
    date: "March 18, 2026 at 10:34 AM",
    tags: ["scraping", "pagination", "e-commerce"],
    likes: 5,
    views: 134,
    body: `I'm trying to scrape product listings from an e-commerce site that uses infinite scroll pagination. My current flow only captures the first page of results (about 20 items) but I need to get all 500+ products.

Here's what I've tried so far:

\`\`\`javascript
const flow = {
  url: "https://example-store.com/products",
  steps: [
    { action: "waitForSelector", selector: ".product-card" },
    { action: "extractAll", selector: ".product-card", fields: {
      name: ".product-name",
      price: ".product-price",
      url: "a@href"
    }}
  ]
}
\`\`\`

The site loads more products when you scroll to the bottom. I've seen mentions of a \`scrollToBottom\` action but I'm not sure how to use it in a loop until all products are loaded.

Any help would be appreciated! I'm on the Pro plan if that matters for rate limits.`,
    replies: [
      {
        id: "r1",
        author: { name: "Sarah Kim", initials: "SK" },
        date: "March 18, 2026 at 11:02 AM",
        body: `Great question! For infinite scroll, you'll want to use the \`scroll\` action combined with a \`waitForNewContent\` check. Here's a pattern that works well:

\`\`\`javascript
{
  action: "loop",
  maxIterations: 50,
  steps: [
    { action: "scrollToBottom" },
    { action: "wait", duration: 1500 },
    { action: "checkForNewContent", selector: ".product-card" }
  ]
}
\`\`\`

The key is the \`checkForNewContent\` step - it compares the count of matching elements before and after scrolling, and breaks the loop when no new items appear.`,
        likes: 12,
        bestAnswer: true,
        nested: {
          id: "r1-1",
          author: { name: "Alex Chen", initials: "AC" },
          date: "March 18, 2026 at 11:15 AM",
          body: "This worked perfectly! I had to bump the wait duration to 2000ms because the site loads slowly, but I'm now getting all 500+ products. Thank you!",
          likes: 3,
        },
      },
      {
        id: "r2",
        author: { name: "Scraper Team", initials: "ST" },
        date: "March 18, 2026 at 12:30 PM",
        body: `Just wanted to add a few tips for handling pagination at scale:

1. **Use incremental delays** - Start with a 1s delay and increase it if you're getting rate limited
2. **Enable the request cache** - This prevents re-fetching data if your flow fails mid-way
3. **Set a reasonable maxIterations** - This prevents infinite loops if the content check has issues

We're also working on a dedicated \`pagination\` action type for v0.6.0 that will handle infinite scroll, "Load More" buttons, and traditional page navigation automatically.`,
        likes: 8,
        staff: true,
      },
      {
        id: "r3",
        author: { name: "Maria Santos", initials: "MS" },
        date: "March 18, 2026 at 2:15 PM",
        body: "I ran into a similar issue with a React-based storefront. One thing that helped was adding a `waitForNetworkIdle` step after each scroll - it waits until all XHR/fetch requests complete, which is more reliable than a fixed delay.",
        likes: 6,
        nested: {
          id: "r3-1",
          author: { name: "Tom Nguyen", initials: "TN" },
          date: "March 18, 2026 at 3:00 PM",
          body: "Seconding the `waitForNetworkIdle` approach. I use it for all my scraping flows and it handles variable load times much better than fixed waits.",
          likes: 2,
        },
      },
    ],
  },
  "price-tracker": {
    id: "price-tracker",
    title: "Built a real-time price tracker with Scraper.bot",
    category: "Show & Tell",
    categoryStyle: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    author: { name: "Maria Santos", initials: "MS" },
    date: "March 18, 2026 at 7:12 AM",
    tags: ["monitoring", "pricing", "dashboard"],
    likes: 28,
    views: 312,
    body: `I just finished building a real-time price tracking dashboard and wanted to share how I did it with Scraper.bot.

The system monitors 500+ products across Amazon, Best Buy, and Walmart. It runs every 30 minutes during business hours and sends Slack alerts when prices drop by more than 10%.

**Architecture:**
- Scraper.bot flows for data collection (one per retailer)
- Webhooks pushing data to a Supabase database
- Next.js dashboard for visualization with Recharts
- Slack integration for price drop alerts

**Key learnings:**
1. Each retailer needs slightly different scraping strategies. Amazon uses dynamic pricing that changes based on headers, so I had to configure custom user agents.
2. Scheduling flows every 30 minutes hits the Pro plan limits, so I stagger them across retailers.
3. The monitoring feature in Scraper.bot is perfect for detecting when a product page structure changes.

Happy to answer any questions or share more details about the setup!`,
    replies: [
      {
        id: "r1",
        author: { name: "James Wilson", initials: "JW" },
        date: "March 18, 2026 at 8:45 AM",
        body: "This is impressive! How do you handle products that have multiple variants (sizes, colors)? Do you track each variant separately or just the base price?",
        likes: 4,
      },
      {
        id: "r2",
        author: { name: "Maria Santos", initials: "MS" },
        date: "March 18, 2026 at 9:30 AM",
        body: "Good question! I track each variant as a separate product entry. The scraper extracts all variants from the product page and creates individual records with a shared `productGroupId`. It adds some complexity but gives much better price insight.",
        likes: 7,
        nested: {
          id: "r2-1",
          author: { name: "James Wilson", initials: "JW" },
          date: "March 18, 2026 at 9:45 AM",
          body: "Smart approach. I might try something similar for my comparison shopping project. Thanks for sharing!",
          likes: 1,
        },
      },
      {
        id: "r3",
        author: { name: "Scraper Team", initials: "ST" },
        date: "March 18, 2026 at 11:00 AM",
        body: "Love seeing projects like this! We'd love to feature this as a case study on our blog if you're interested. Feel free to reach out to us at team@scraper.bot.",
        likes: 5,
        staff: true,
      },
    ],
  },
  "welcome": {
    id: "welcome",
    title: "Welcome to the Scraper.bot Community! Read First",
    category: "General",
    categoryStyle: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    author: { name: "Scraper Team", initials: "ST" },
    date: "March 4, 2026 at 9:00 AM",
    tags: ["announcement", "rules"],
    likes: 89,
    views: 4820,
    staff: true,
    body: `Welcome to the official Scraper.bot Community Forum! We're thrilled to have you here.

This is the place to ask questions, share your projects, request features, and connect with other Scraper.bot users and our team.

**Community Guidelines:**

1. **Be respectful** - Treat everyone with respect. Healthy debate is welcome, personal attacks are not.
2. **Search before posting** - Your question may have already been answered. Use the search bar to check.
3. **Use the right category** - Post in the appropriate category to help others find and answer your questions.
4. **Share your knowledge** - If you've solved a tricky problem, share your solution! It helps the whole community.
5. **No spam or self-promotion** - Keep posts relevant to Scraper.bot and web scraping in general.

**Categories:**
- **General** - Announcements, discussions, and anything that doesn't fit elsewhere
- **Help & Support** - Questions about using Scraper.bot
- **Show & Tell** - Share your projects and use cases
- **Feature Requests** - Suggest new features or improvements
- **Bug Reports** - Report issues you've encountered

Looking forward to building this community with you!`,
    replies: [
      {
        id: "r1",
        author: { name: "Emily Zhang", initials: "EZ" },
        date: "March 4, 2026 at 10:15 AM",
        body: "Excited to be here! Just signed up for Scraper.bot last week and already loving it. Looking forward to learning from everyone.",
        likes: 15,
      },
      {
        id: "r2",
        author: { name: "Ryan Foster", initials: "RF" },
        date: "March 4, 2026 at 11:30 AM",
        body: "Great to see an official community forum! Will there be any community events or webinars?",
        likes: 8,
        nested: {
          id: "r2-1",
          author: { name: "Scraper Team", initials: "ST" },
          date: "March 4, 2026 at 12:00 PM",
          body: "Absolutely! We're planning monthly community calls starting in April. We'll post details here soon.",
          likes: 12,
          staff: true,
        },
      },
    ],
  },
}

function ReplyCard({ reply, isNested = false }: { reply: Reply; isNested?: boolean }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className={cn(
      "flex gap-3",
      isNested && "ml-10 mt-3"
    )}>
      <Avatar className={cn("size-8 shrink-0", reply.staff ? "ring-2 ring-blue-500" : "")}>
        <AvatarFallback className={cn(
          "text-xs font-medium",
          reply.staff ? "bg-blue-600 text-white" : "bg-muted"
        )}>
          {reply.author.initials}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        "flex-1 border rounded-lg p-4",
        reply.bestAnswer && "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20",
        reply.staff && !reply.bestAnswer && "border-blue-200 dark:border-blue-800"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">{reply.author.name}</span>
          {reply.staff && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Staff</Badge>
          )}
          {reply.bestAnswer && (
            <Badge className="text-[10px] px-1.5 py-0 bg-green-600 hover:bg-green-600">
              <CheckCircle2 className="size-3 mr-0.5" />
              Best Answer
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{reply.date}</span>
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {reply.body.split(/(```[\s\S]*?```|`[^`]+`)/g).map((part, i) => {
            if (part.startsWith("```")) {
              const code = part.replace(/```\w*\n?/, "").replace(/```$/, "")
              return (
                <pre key={i} className="bg-muted rounded-md p-3 my-2 overflow-x-auto text-xs font-mono">
                  <code>{code}</code>
                </pre>
              )
            }
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <code key={i} className="bg-muted rounded px-1.5 py-0.5 text-xs font-mono">
                  {part.slice(1, -1)}
                </code>
              )
            }
            return <span key={i}>{part}</span>
          })}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => setLiked(!liked)}
            className={cn(
              "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
              liked && "text-red-500 hover:text-red-600"
            )}
          >
            <Heart className={cn("size-3.5", liked && "fill-current")} />
            {reply.likes + (liked ? 1 : 0)}
          </button>
          {!isNested && !reply.bestAnswer && (
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Mark as Best Answer
            </button>
          )}
        </div>
        {reply.nested && (
          <ReplyCard reply={reply.nested} isNested />
        )}
      </div>
    </div>
  )
}

export default function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const thread = threads[id]
  const [liked, setLiked] = useState(false)
  const [showAllReplies, setShowAllReplies] = useState(true)

  if (!thread) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold mb-2">Post not found</h1>
          <p className="text-muted-foreground mb-4">This post doesn't exist or has been removed.</p>
          <Link href="/community">
            <Button variant="outline">Back to Community</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="size-4" />
          Back to Community
        </Link>

        <article className="border rounded-lg bg-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border-0",
              thread.categoryStyle
            )}>
              {thread.category}
            </span>
            <div className="flex items-center gap-1.5">
              {thread.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight mb-4">
            {thread.title}
          </h1>

          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            <Avatar className={cn(thread.staff ? "ring-2 ring-blue-500" : "")}>
              <AvatarFallback className={cn(
                "text-xs font-medium",
                thread.staff ? "bg-blue-600 text-white" : "bg-muted"
              )}>
                {thread.author.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{thread.author.name}</span>
                {thread.staff && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Staff</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{thread.date}</span>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
            {thread.body.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
              if (part.startsWith("```")) {
                const code = part.replace(/```\w*\n?/, "").replace(/```$/, "")
                return (
                  <pre key={i} className="bg-muted rounded-md p-4 my-3 overflow-x-auto text-xs font-mono">
                    <code>{code}</code>
                  </pre>
                )
              }
              if (part.startsWith("`") && part.endsWith("`")) {
                return (
                  <code key={i} className="bg-muted rounded px-1.5 py-0.5 text-xs font-mono">
                    {part.slice(1, -1)}
                  </code>
                )
              }
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i}>{part.slice(2, -2)}</strong>
              }
              return <span key={i} className="whitespace-pre-wrap">{part}</span>
            })}
          </div>

          <div className="flex items-center gap-3 mt-6 pt-4 border-t">
            <button
              onClick={() => setLiked(!liked)}
              className={cn(
                "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted",
                liked && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart className={cn("size-4", liked && "fill-current")} />
              {thread.likes + (liked ? 1 : 0)}
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted">
              <Share2 className="size-4" />
              Share
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted">
              <Flag className="size-4" />
              Report
            </button>
          </div>
        </article>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="size-5" />
              {thread.replies.length} {thread.replies.length === 1 ? "Reply" : "Replies"}
            </h2>
            <button
              onClick={() => setShowAllReplies(!showAllReplies)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {showAllReplies ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              {showAllReplies ? "Collapse" : "Expand"}
            </button>
          </div>

          {showAllReplies && (
            <div className="space-y-4">
              {thread.replies.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>

        <div className="border rounded-lg bg-card p-6">
          <h3 className="font-semibold mb-3">Post a Reply</h3>
          <div className="flex items-center gap-1 mb-2 border rounded-md p-1 w-fit bg-muted/50">
            <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Bold">
              <Bold className="size-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Italic">
              <Italic className="size-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Code">
              <Code className="size-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Link">
              <LinkIcon className="size-4 text-muted-foreground" />
            </button>
          </div>
          <Textarea
            placeholder="Write your reply... Markdown is supported"
            className="min-h-32 mb-3"
          />
          <Button>
            Post Reply
          </Button>
        </div>
      </div>
    </div>
  )
}
