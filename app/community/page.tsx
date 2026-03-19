"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Pin, MessageSquare, Eye, Heart, Home, BookOpen, LayoutDashboard, FileText, Wifi } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type Category = "General" | "Help & Support" | "Show & Tell" | "Feature Requests" | "Bug Reports"

interface Post {
  id: string
  title: string
  preview: string
  category: Category
  author: { name: string; initials: string }
  timeAgo: string
  replies: number
  views: number
  likes: number
  tags: string[]
  pinned?: boolean
  staff?: boolean
}

const categoryStyles: Record<Category, string> = {
  "General": "bg-muted text-muted-foreground",
  "Help & Support": "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  "Show & Tell": "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  "Feature Requests": "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  "Bug Reports": "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
}

const pinnedPosts: Post[] = [
  {
    id: "welcome",
    title: "Welcome to the Scraper.bot Community! Read First",
    preview: "Hey everyone! Welcome to the official Scraper.bot community forum. Here you can ask questions, share your projects, and connect with other...",
    category: "General",
    author: { name: "Scraper Team", initials: "ST" },
    timeAgo: "2 weeks ago",
    replies: 156,
    views: 4820,
    likes: 89,
    tags: ["announcement", "rules"],
    pinned: true,
    staff: true,
  },
  {
    id: "release-v050",
    title: "Scraper.bot v0.5.0 Release Notes",
    preview: "We're excited to announce the release of v0.5.0! This update includes AI-powered selector suggestions, webhook retry logic, and improved...",
    category: "General",
    author: { name: "Scraper Team", initials: "ST" },
    timeAgo: "5 days ago",
    replies: 23,
    views: 1240,
    likes: 45,
    tags: ["release", "changelog"],
    pinned: true,
    staff: true,
  },
]

const regularPosts: Post[] = [
  {
    id: "paginated-ecommerce",
    title: "How to scrape a paginated e-commerce site?",
    preview: "I'm trying to scrape product listings from a site that uses infinite scroll pagination. I've set up a basic flow but it only captures the first...",
    category: "Help & Support",
    author: { name: "Alex Chen", initials: "AC" },
    timeAgo: "2 hours ago",
    replies: 8,
    views: 134,
    likes: 5,
    tags: ["scraping", "pagination", "e-commerce"],
  },
  {
    id: "price-tracker",
    title: "Built a real-time price tracker with Scraper.bot",
    preview: "Just finished building a price tracking dashboard that monitors 500+ products across 3 different retailers. Using scheduled flows with webhook...",
    category: "Show & Tell",
    author: { name: "Maria Santos", initials: "MS" },
    timeAgo: "5 hours ago",
    replies: 15,
    views: 312,
    likes: 28,
    tags: ["monitoring", "pricing", "dashboard"],
  },
  {
    id: "webhook-retry",
    title: "Feature Request: Webhook retry configuration",
    preview: "It would be great to have configurable retry logic for webhooks. Currently if my endpoint is temporarily down, the webhook payload is lost...",
    category: "Feature Requests",
    author: { name: "James Wilson", initials: "JW" },
    timeAgo: "8 hours ago",
    replies: 6,
    views: 89,
    likes: 12,
    tags: ["webhooks", "api", "reliability"],
  },
  {
    id: "error-429",
    title: "Error 429 when scraping Craigslist",
    preview: "I'm getting rate limited (HTTP 429) after about 50 requests to Craigslist. I've tried adding delays between requests but it doesn't seem...",
    category: "Bug Reports",
    author: { name: "David Park", initials: "DP" },
    timeAgo: "12 hours ago",
    replies: 3,
    views: 67,
    likes: 2,
    tags: ["rate-limiting", "scraping"],
  },
  {
    id: "scheduling-best-practices",
    title: "Best practices for scheduling flows",
    preview: "I've been using Scraper.bot for a few months now and wanted to share some tips on how to optimize your scheduled flows for reliability and...",
    category: "General",
    author: { name: "Sarah Kim", initials: "SK" },
    timeAgo: "1 day ago",
    replies: 11,
    views: 256,
    likes: 19,
    tags: ["scheduling", "best-practices"],
  },
  {
    id: "python-async",
    title: "Python SDK - async support?",
    preview: "Is there any plan to add async/await support to the Python SDK? I'm building a high-throughput pipeline and synchronous calls are becoming a...",
    category: "Feature Requests",
    author: { name: "Tom Nguyen", initials: "TN" },
    timeAgo: "1 day ago",
    replies: 4,
    views: 98,
    likes: 7,
    tags: ["python", "api", "async"],
  },
  {
    id: "job-listings",
    title: "My first scraper! Job listings aggregator",
    preview: "After a week of learning Scraper.bot, I built my first real project - a job listings aggregator that pulls from LinkedIn, Indeed, and...",
    category: "Show & Tell",
    author: { name: "Emily Zhang", initials: "EZ" },
    timeAgo: "2 days ago",
    replies: 22,
    views: 478,
    likes: 35,
    tags: ["scraping", "jobs", "beginner"],
  },
  {
    id: "login-pages",
    title: "How to handle login-required pages?",
    preview: "I need to scrape data from a site that requires authentication. How do I handle login flows in Scraper.bot? Do I need to manage cookies...",
    category: "Help & Support",
    author: { name: "Ryan Foster", initials: "RF" },
    timeAgo: "3 days ago",
    replies: 9,
    views: 203,
    likes: 8,
    tags: ["authentication", "scraping", "cookies"],
  },
]

const allPosts = [...pinnedPosts, ...regularPosts]

const topContributors = [
  { name: "Sarah Kim", initials: "SK", posts: 47 },
  { name: "Alex Chen", initials: "AC", posts: 38 },
  { name: "Maria Santos", initials: "MS", posts: 31 },
  { name: "Tom Nguyen", initials: "TN", posts: 24 },
  { name: "Emily Zhang", initials: "EZ", posts: 19 },
]

const popularTags = ["scraping", "api", "scheduling", "pricing", "python", "javascript", "monitoring", "templates"]

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/community/${post.id}`} className="block">
      <div className={cn(
        "border rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-card",
        post.pinned && "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20"
      )}>
        <div className="flex items-start gap-3">
          <Avatar className={cn("mt-0.5", post.staff ? "ring-2 ring-blue-500" : "")}>
            <AvatarFallback className={cn(
              "text-xs font-medium",
              post.staff ? "bg-blue-600 text-white" : "bg-muted"
            )}>
              {post.author.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {post.pinned && (
                <Pin className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              )}
              <span className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border-0",
                categoryStyles[post.category]
              )}>
                {post.category}
              </span>
            </div>
            <h3 className="font-serif text-base font-semibold leading-snug mb-1 group-hover:text-blue-600">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
              {post.preview}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {post.author.name}
                {post.staff && (
                  <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">Staff</Badge>
                )}
                <span className="mx-1.5">·</span>
                {post.timeAgo}
              </span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3" />
                  {post.replies}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {post.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="size-3" />
                  {post.likes}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.preview.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = activeTab === "all" || (() => {
      const categoryMap: Record<string, Category> = {
        general: "General",
        help: "Help & Support",
        "show-tell": "Show & Tell",
        features: "Feature Requests",
        bugs: "Bug Reports",
      }
      return post.category === categoryMap[activeTab]
    })()

    return matchesSearch && matchesCategory
  })

  const pinned = filteredPosts.filter((p) => p.pinned)
  const regular = filteredPosts.filter((p) => !p.pinned)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-blue-600 text-white text-center py-3 text-sm font-medium">
        Community launching soon. Below is a preview of what it will look like.
      </div>

      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-serif text-2xl font-bold tracking-tight shrink-0">
              Scraper.bot Demo Community
            </h1>
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Link href="/community/new">
                <Button>
                  <Plus className="size-4" />
                  New Post
                </Button>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="size-4" />
                  Home
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  <BookOpen className="size-4" />
                  Docs
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground italic">
          <span>Sample data shown for preview purposes</span>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="help">Help & Support</TabsTrigger>
                <TabsTrigger value="show-tell">Show & Tell</TabsTrigger>
                <TabsTrigger value="features">Feature Requests</TabsTrigger>
                <TabsTrigger value="bugs">Bug Reports</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="space-y-2">
                  {pinned.length > 0 && (
                    <>
                      {pinned.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                      {regular.length > 0 && (
                        <div className="border-t my-3" />
                      )}
                    </>
                  )}
                  {regular.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {filteredPosts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No posts found matching your criteria.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="hidden lg:block w-72 shrink-0 space-y-6">
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-semibold text-sm mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs font-normal cursor-pointer hover:bg-accent">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-semibold text-sm mb-3">Top Contributors</h3>
              <div className="space-y-3">
                {topContributors.map((user) => (
                  <div key={user.name} className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px] font-medium bg-muted">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex-1">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/docs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <BookOpen className="size-3.5" />
                  Documentation
                </Link>
                <Link href="/docs/api" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <FileText className="size-3.5" />
                  API Reference
                </Link>
                <Link href="/status" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Wifi className="size-3.5" />
                  Status Page
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
