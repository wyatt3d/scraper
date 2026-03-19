"use client"

import { useState } from "react"
import {
  Download,
  Eye,
  Search,
  Star,
  Upload,
  User,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MarketplaceFlow {
  id: string
  name: string
  author: string
  authorAvatar?: string
  description: string
  fullDescription: string
  category: string
  rating: number
  reviewCount: number
  installs: number
  price: string
  steps: string[]
  outputFields: string[]
  reviews: { author: string; rating: number; text: string; date: string }[]
}

const CATEGORIES = [
  "All",
  "Data Extraction",
  "Price Monitoring",
  "Lead Generation",
  "Social Media",
  "E-Commerce",
  "Real Estate",
  "Job Boards",
  "Custom",
]

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "runs", label: "Most Runs" },
  { value: "rated", label: "Highest Rated" },
]

const FEATURED_FLOWS: MarketplaceFlow[] = [
  {
    id: "mkt-1",
    name: "Amazon Product Tracker",
    author: "@datawhiz",
    description: "Extract prices, reviews, and ratings from Amazon product pages with automatic change detection.",
    fullDescription: "A comprehensive Amazon monitoring flow that tracks product prices, review counts, star ratings, and availability status across multiple ASINs. Supports pagination through search results and handles dynamic content loading. Includes built-in price drop alerts and historical data comparison.",
    category: "Price Monitoring",
    rating: 4.9,
    reviewCount: 342,
    installs: 2300,
    price: "Free",
    steps: ["Navigate to product page", "Wait for dynamic content", "Extract price and title", "Extract review data", "Compare with previous run", "Store results"],
    outputFields: ["productName", "price", "rating", "reviewCount", "availability", "priceChange"],
    reviews: [
      { author: "scrapeking", rating: 5, text: "Flawless. Saved me hours of manual price checking across 200+ products.", date: "2026-03-10" },
      { author: "ecom_analyst", rating: 5, text: "Best Amazon scraper I have tried. Handles edge cases well and rarely fails.", date: "2026-03-05" },
      { author: "pricewatcher", rating: 4, text: "Works great for most products. Occasionally misses variant pricing.", date: "2026-02-28" },
    ],
  },
  {
    id: "mkt-2",
    name: "LinkedIn Job Scraper",
    author: "@recruitbot",
    description: "Automated job listing extraction with filters for location, salary, and experience level.",
    fullDescription: "Extracts job postings from LinkedIn search results including title, company, location, salary range, posting date, and application link. Supports custom search queries with filters for experience level, job type, and remote options. Handles pagination and deduplication across runs.",
    category: "Job Boards",
    rating: 4.7,
    reviewCount: 215,
    installs: 1800,
    price: "$3/mo",
    steps: ["Navigate to job search", "Apply search filters", "Wait for results", "Extract listing data", "Paginate through pages", "Deduplicate results"],
    outputFields: ["title", "company", "location", "salary", "postDate", "applicationUrl", "experienceLevel"],
    reviews: [
      { author: "hr_tech", rating: 5, text: "Game changer for our recruiting pipeline. Saves 10+ hours weekly.", date: "2026-03-12" },
      { author: "jobseeker_pro", rating: 4, text: "Very reliable. Wish it could also extract job descriptions.", date: "2026-03-01" },
    ],
  },
  {
    id: "mkt-3",
    name: "Zillow Property Monitor",
    author: "@realtyai",
    description: "Real estate price monitoring with change alerts and market trend tracking.",
    fullDescription: "Monitors Zillow listings for price changes, new listings, and status updates (active, pending, sold). Tracks properties by zip code or custom search criteria. Includes historical price data and days-on-market calculations. Sends alerts when new properties match your criteria or when prices drop.",
    category: "Real Estate",
    rating: 4.8,
    reviewCount: 178,
    installs: 1500,
    price: "Free",
    steps: ["Navigate to search results", "Apply location filters", "Extract property listings", "Track price changes", "Detect new listings", "Generate market summary"],
    outputFields: ["address", "price", "beds", "baths", "sqft", "daysOnMarket", "priceChange", "status"],
    reviews: [
      { author: "investor_mike", rating: 5, text: "Caught a price drop within minutes. Already saved me $15k on a purchase.", date: "2026-03-14" },
      { author: "realtor_jane", rating: 5, text: "My clients love getting instant alerts on new listings in their area.", date: "2026-03-08" },
      { author: "house_hunter", rating: 4, text: "Works well for most areas. Some rural zip codes have limited data.", date: "2026-02-20" },
    ],
  },
]

const MARKETPLACE_FLOWS: MarketplaceFlow[] = [
  ...FEATURED_FLOWS,
  {
    id: "mkt-4",
    name: "Google Maps Extractor",
    author: "@localdatascraper",
    description: "Extract business names, ratings, phone numbers, and addresses from Google Maps search results.",
    fullDescription: "Comprehensive Google Maps scraper that extracts business information including name, address, phone, website, rating, review count, and business hours. Supports custom search queries and geographic bounds.",
    category: "Lead Generation",
    rating: 4.6,
    reviewCount: 289,
    installs: 2100,
    price: "$5/mo",
    steps: ["Search Google Maps", "Wait for results to load", "Extract business cards", "Scroll for more results", "Collect contact details"],
    outputFields: ["businessName", "address", "phone", "website", "rating", "reviewCount"],
    reviews: [
      { author: "lead_gen_pro", rating: 5, text: "Pulled 500 leads in under 10 minutes. Amazing for local business outreach.", date: "2026-03-11" },
      { author: "biz_finder", rating: 4, text: "Very reliable but could use better deduplication.", date: "2026-03-02" },
    ],
  },
  {
    id: "mkt-5",
    name: "Twitter/X Trend Analyzer",
    author: "@socialmetrics",
    description: "Track hashtags, engagement metrics, and trending topics in real-time.",
    fullDescription: "Monitors Twitter/X for specific hashtags, keywords, or accounts. Extracts tweet content, engagement metrics (likes, retweets, replies), and author information. Supports sentiment analysis integration and trend detection.",
    category: "Social Media",
    rating: 4.4,
    reviewCount: 156,
    installs: 1200,
    price: "$4/mo",
    steps: ["Navigate to search/hashtag", "Load tweet stream", "Extract tweet data", "Capture engagement metrics", "Aggregate trends"],
    outputFields: ["tweetText", "author", "likes", "retweets", "replies", "timestamp"],
    reviews: [
      { author: "social_mgr", rating: 4, text: "Solid tool for tracking campaign hashtags and competitor mentions.", date: "2026-03-09" },
      { author: "analytics_guru", rating: 5, text: "Perfect for building engagement reports. Saves my team hours.", date: "2026-02-25" },
    ],
  },
  {
    id: "mkt-6",
    name: "Shopify Store Analyzer",
    author: "@ecomspy",
    description: "Analyze competitor Shopify stores for products, pricing, and best sellers.",
    fullDescription: "Extracts product catalog data from any Shopify store including product names, prices, variants, descriptions, images, and collection organization. Identifies best sellers and pricing strategies.",
    category: "E-Commerce",
    rating: 4.7,
    reviewCount: 198,
    installs: 1650,
    price: "$6/mo",
    steps: ["Navigate to store", "Extract product catalog", "Parse variants and pricing", "Identify collections", "Map product hierarchy"],
    outputFields: ["productName", "price", "compareAtPrice", "variants", "collection", "imageUrl"],
    reviews: [
      { author: "dropshipper", rating: 5, text: "Essential for competitive research. Found winning products fast.", date: "2026-03-13" },
      { author: "brand_owner", rating: 4, text: "Great for monitoring competitor pricing. Works on 99% of Shopify stores.", date: "2026-03-06" },
    ],
  },
  {
    id: "mkt-7",
    name: "Indeed Resume Harvester",
    author: "@talentfinder",
    description: "Extract candidate profiles and resumes from Indeed for recruitment pipelines.",
    fullDescription: "Searches Indeed for candidate profiles matching specific job titles, skills, and locations. Extracts name, title, experience summary, skills, education, and contact availability. Supports bulk export and CRM integration.",
    category: "Lead Generation",
    rating: 4.3,
    reviewCount: 134,
    installs: 920,
    price: "$8/mo",
    steps: ["Search for candidates", "Apply experience filters", "Extract profile summaries", "Parse skills and education", "Export results"],
    outputFields: ["name", "title", "location", "experience", "skills", "education"],
    reviews: [
      { author: "recruiter_sam", rating: 4, text: "Good for sourcing passive candidates. Wish it had more filter options.", date: "2026-03-07" },
      { author: "hr_director", rating: 5, text: "Cut our sourcing time by 60%. Integrates well with our ATS.", date: "2026-02-22" },
    ],
  },
  {
    id: "mkt-8",
    name: "Yelp Review Aggregator",
    author: "@reviewmaster",
    description: "Collect and analyze reviews from Yelp for reputation monitoring.",
    fullDescription: "Monitors Yelp business pages for new reviews, extracting review text, star rating, reviewer info, photos, and response status. Supports sentiment tracking and alert triggers for negative reviews.",
    category: "Data Extraction",
    rating: 4.5,
    reviewCount: 167,
    installs: 1100,
    price: "Free",
    steps: ["Navigate to business page", "Load review section", "Extract review data", "Parse ratings and dates", "Track sentiment changes"],
    outputFields: ["reviewText", "rating", "reviewerName", "date", "photos", "ownerResponse"],
    reviews: [
      { author: "restaurant_owner", rating: 5, text: "Finally, I can track my reviews without checking Yelp 10 times a day.", date: "2026-03-15" },
      { author: "brand_monitor", rating: 4, text: "Works well. Occasionally misses reviews posted in the first few hours.", date: "2026-03-03" },
    ],
  },
  {
    id: "mkt-9",
    name: "eBay Auction Sniper",
    author: "@auctionfinder",
    description: "Monitor eBay auctions ending soon with price alerts and bid tracking.",
    fullDescription: "Tracks eBay auctions matching your criteria, monitoring bid count, current price, time remaining, and seller reputation. Sends alerts when auctions are ending soon or when prices drop below your target.",
    category: "E-Commerce",
    rating: 4.6,
    reviewCount: 201,
    installs: 1450,
    price: "$2/mo",
    steps: ["Search for items", "Filter by auction type", "Extract auction details", "Track bid history", "Alert on ending soon"],
    outputFields: ["itemName", "currentBid", "bidCount", "timeRemaining", "sellerRating", "shippingCost"],
    reviews: [
      { author: "bargain_hunter", rating: 5, text: "Snagged 3 items below market value this week alone.", date: "2026-03-16" },
      { author: "collector_joe", rating: 4, text: "Great for tracking rare items. The ending-soon alerts are clutch.", date: "2026-03-04" },
    ],
  },
  {
    id: "mkt-10",
    name: "Crunchbase Company Scraper",
    author: "@vcdata",
    description: "Extract startup funding data, team info, and company details from Crunchbase.",
    fullDescription: "Scrapes Crunchbase company profiles for funding rounds, investor details, team members, company size, industry classification, and contact information. Supports batch processing of company lists.",
    category: "Data Extraction",
    rating: 4.5,
    reviewCount: 143,
    installs: 870,
    price: "$7/mo",
    steps: ["Navigate to company profile", "Extract funding history", "Parse team members", "Collect company metrics", "Export structured data"],
    outputFields: ["companyName", "totalFunding", "lastRound", "employees", "industry", "founders"],
    reviews: [
      { author: "vc_analyst", rating: 5, text: "Replaced our Crunchbase Pro subscription. Pays for itself.", date: "2026-03-10" },
      { author: "startup_scout", rating: 4, text: "Very accurate data. Would love company news integration.", date: "2026-02-28" },
    ],
  },
  {
    id: "mkt-11",
    name: "Weather Data Collector",
    author: "@climatedev",
    description: "Aggregate historical and forecast weather data from multiple sources.",
    fullDescription: "Collects weather data including temperature, precipitation, humidity, wind speed, and forecasts from various weather services. Supports custom location lists and historical data retrieval for trend analysis.",
    category: "Custom",
    rating: 3.9,
    reviewCount: 67,
    installs: 340,
    price: "Free",
    steps: ["Set target locations", "Navigate to weather source", "Extract current conditions", "Collect forecast data", "Merge multiple sources"],
    outputFields: ["location", "temperature", "humidity", "windSpeed", "precipitation", "forecast"],
    reviews: [
      { author: "data_scientist", rating: 4, text: "Perfect for my agricultural ML models. Reliable and well-structured output.", date: "2026-03-08" },
      { author: "weather_nerd", rating: 4, text: "Covers most major weather services. Good enough for hobbyist use.", date: "2026-02-15" },
    ],
  },
  {
    id: "mkt-12",
    name: "Court Records Monitor",
    author: "@legalbot",
    description: "Track court filings, case updates, and legal records from public databases.",
    fullDescription: "Monitors public court record databases for new filings, case status changes, and document uploads. Supports federal, state, and county court systems. Sends alerts on specific case numbers or party names.",
    category: "Custom",
    rating: 4.2,
    reviewCount: 89,
    installs: 560,
    price: "$10/mo",
    steps: ["Navigate to court portal", "Search by case/party", "Extract filing details", "Track status changes", "Alert on updates"],
    outputFields: ["caseNumber", "parties", "filingDate", "documentType", "status", "nextHearing"],
    reviews: [
      { author: "paralegal_pro", rating: 5, text: "Monitors 50+ cases for our firm. Never misses a filing update.", date: "2026-03-12" },
      { author: "legal_researcher", rating: 4, text: "Covers most court systems. Some smaller counties are not supported yet.", date: "2026-02-20" },
    ],
  },
]

function formatInstalls(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "size-3.5" : "size-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-zinc-300 dark:text-zinc-600"
          )}
        />
      ))}
    </div>
  )
}

function FlowCard({
  flow,
  onPreview,
  featured = false,
}: {
  flow: MarketplaceFlow
  onPreview: () => void
  featured?: boolean
}) {
  const categoryColors: Record<string, string> = {
    "Data Extraction": "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/25",
    "Price Monitoring": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    "Lead Generation": "bg-muted text-foreground border-border",
    "Social Media": "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/25",
    "E-Commerce": "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/25",
    "Real Estate": "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/25",
    "Job Boards": "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25",
    "Custom": "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/25",
  }

  return (
    <Card className={cn("flex flex-col justify-between", featured && "border-foreground/20")}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-base font-bold leading-tight">{flow.name}</h3>
          <Badge
            variant="outline"
            className={cn(
              "text-xs shrink-0",
              flow.price === "Free"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25"
            )}
          >
            {flow.price}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex size-5 items-center justify-center rounded-full bg-muted">
            <User className="size-3 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">{flow.author}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{flow.description}</p>

        <Badge variant="outline" className={cn("text-xs", categoryColors[flow.category] || categoryColors["Custom"])}>
          {flow.category}
        </Badge>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <StarRating rating={flow.rating} />
            <span className="text-xs text-muted-foreground">
              {flow.rating} ({flow.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="size-3" />
            {formatInstalls(flow.installs)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0 gap-2">
        <Link href="/flows/new" className="flex-1">
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Use Flow
          </Button>
        </Link>
        <Button size="sm" variant="outline" onClick={onPreview}>
          <Eye className="size-3.5" />
          Preview
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("popular")
  const [previewFlow, setPreviewFlow] = useState<MarketplaceFlow | null>(null)

  const filtered = MARKETPLACE_FLOWS.filter((f) => {
    const matchesSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      f.author.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === "All" || f.category === category
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sort) {
      case "popular":
        return b.installs - a.installs
      case "newest":
        return b.id.localeCompare(a.id)
      case "runs":
        return b.installs - a.installs
      case "rated":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Flow Marketplace
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and install community-built flows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search flows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => toast("Publishing coming soon")}>
            <Upload className="size-3.5" />
            Publish Your Flow
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === cat
                  ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500"
                  : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {category === "All" && !search && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-semibold">Featured</h2>
            <Badge variant="secondary" className="text-xs">Top Picks</Badge>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FEATURED_FLOWS.map((flow) => (
              <FlowCard key={flow.id} flow={flow} onPreview={() => setPreviewFlow(flow)} featured />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-serif text-lg font-semibold">
          {category === "All" && !search ? "All Flows" : `${filtered.length} results`}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((flow) => (
            <FlowCard key={flow.id} flow={flow} onPreview={() => setPreviewFlow(flow)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="size-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No flows found matching your search.</p>
          </div>
        )}
      </div>

      <Dialog open={!!previewFlow} onOpenChange={(open) => !open && setPreviewFlow(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {previewFlow && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">{previewFlow.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{previewFlow.author}</p>
                      <p className="text-xs text-muted-foreground">Flow Author</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={previewFlow.rating} size="md" />
                      <span className="text-sm font-medium">{previewFlow.rating}</span>
                      <span className="text-xs text-muted-foreground">({previewFlow.reviewCount})</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        previewFlow.price === "Free"
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/25"
                          : "bg-amber-500/15 text-amber-600 border-amber-500/25"
                      )}
                    >
                      {previewFlow.price}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1.5">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{previewFlow.fullDescription}</p>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Download className="size-3.5 text-muted-foreground" />
                      <span className="font-medium">{formatInstalls(previewFlow.installs)}</span>
                      <span className="text-muted-foreground">installs</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Steps</h4>
                  <div className="space-y-1.5">
                    {previewFlow.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-medium shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Output Schema</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewFlow.outputFields.map((field) => (
                      <Badge key={field} variant="secondary" className="font-mono text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Reviews</h4>
                  <div className="space-y-3">
                    {previewFlow.reviews.map((review, i) => (
                      <div key={i} className="rounded-lg border p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                              <User className="size-3 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium">@{review.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-1.5" onClick={() => { toast.success("Flow installed"); setPreviewFlow(null) }}>
                  Install Flow
                  <ChevronRight className="size-4" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
