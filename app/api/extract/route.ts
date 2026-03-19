import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { url, instructions, schema } = body

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 })
  }

  const hostname = new URL(url).hostname

  const mockResults: Record<string, Record<string, unknown>[]> = {
    "example-store.com": [
      { name: "Wireless Headphones Pro", price: 79.99, currency: "USD", inStock: true, rating: 4.5 },
      { name: "USB-C Hub 7-in-1", price: 34.99, currency: "USD", inStock: true, rating: 4.2 },
      { name: "Mechanical Keyboard", price: 129.99, currency: "USD", inStock: false, rating: 4.8 },
    ],
    "example-jobs.com": [
      { title: "Senior Software Engineer", company: "TechCorp", location: "San Francisco, CA", salary: "$180k-$220k" },
      { title: "Full Stack Developer", company: "StartupXYZ", location: "Remote", salary: "$140k-$170k" },
    ],
    "craigslist.org": [
      { title: "2019 Honda Civic EX", price: 18500, location: "Austin, TX", link: "/post/12345" },
      { title: "2020 Toyota Camry SE", price: 21000, location: "Dallas, TX", link: "/post/12346" },
    ],
  }

  const matchedKey = Object.keys(mockResults).find((key) => hostname.includes(key))
  const items = matchedKey
    ? mockResults[matchedKey]
    : [
        { title: "Sample Item 1", value: "Extracted from " + url },
        { title: "Sample Item 2", value: "Based on: " + (instructions ?? "default extraction") },
      ]

  return NextResponse.json({
    data: {
      url,
      instructions: instructions ?? null,
      schema: schema ?? null,
      extractedAt: new Date().toISOString(),
      itemCount: items.length,
      items,
    },
  })
}
