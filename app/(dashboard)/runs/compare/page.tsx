"use client"

import { useState } from "react"
import {
  ArrowRight,
  GitCompare,
  Plus,
  Minus,
  RefreshCw,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface RunOption {
  id: string
  label: string
  date: string
  items: number
}

interface ProductItem {
  name: string
  price: string
  rating: string
  reviews: string
  url: string
}

interface ChangedItem {
  name: string
  field: string
  oldValue: string
  newValue: string
}

const mockRuns: RunOption[] = [
  { id: "run-001", label: "Amazon Products - Mar 19, 8:00 AM", date: "2025-03-19T08:00:00Z", items: 25 },
  { id: "run-002", label: "Amazon Products - Mar 19, 2:00 PM", date: "2025-03-19T14:00:00Z", items: 28 },
  { id: "run-003", label: "Amazon Products - Mar 18, 8:00 AM", date: "2025-03-18T08:00:00Z", items: 23 },
  { id: "run-004", label: "Amazon Products - Mar 18, 2:00 PM", date: "2025-03-18T14:00:00Z", items: 24 },
  { id: "run-005", label: "Amazon Products - Mar 17, 8:00 AM", date: "2025-03-17T08:00:00Z", items: 22 },
]

const mockAdded: ProductItem[] = [
  { name: "JBL Tune 760NC Wireless Headphones", price: "$79.95", rating: "4.4", reviews: "3,201", url: "https://amazon.com/dp/B09EXAMPLE1" },
  { name: "Soundcore Space Q45 by Anker", price: "$99.99", rating: "4.5", reviews: "1,847", url: "https://amazon.com/dp/B09EXAMPLE2" },
  { name: "Beats Studio Pro Wireless", price: "$249.99", rating: "4.3", reviews: "952", url: "https://amazon.com/dp/B09EXAMPLE3" },
]

const mockRemoved: ProductItem[] = [
  { name: "Skullcandy Crusher ANC 2", price: "$199.99", rating: "4.1", reviews: "2,105", url: "https://amazon.com/dp/B08REMOVED1" },
  { name: "Plantronics BackBeat Go 810", price: "$89.99", rating: "3.9", reviews: "1,432", url: "https://amazon.com/dp/B08REMOVED2" },
]

const mockChanged: ChangedItem[] = [
  { name: "Sony WH-1000XM5", field: "price", oldValue: "$348.00", newValue: "$278.00" },
  { name: "Sony WH-1000XM5", field: "reviews", oldValue: "11,892", newValue: "12,453" },
  { name: "Apple AirPods Max", field: "price", oldValue: "$479.99", newValue: "$449.99" },
  { name: "Bose QuietComfort Ultra", field: "price", oldValue: "$349.00", newValue: "$329.00" },
  { name: "Bose QuietComfort Ultra", field: "reviews", oldValue: "5,844", newValue: "6,102" },
  { name: "Sennheiser Momentum 4", field: "price", oldValue: "$379.95", newValue: "$349.95" },
  { name: "Samsung Galaxy Buds2 Pro", field: "rating", oldValue: "4.3", newValue: "4.4" },
  { name: "Samsung Galaxy Buds2 Pro", field: "reviews", oldValue: "7,210", newValue: "7,598" },
]

export default function CompareRunsPage() {
  const [runA, setRunA] = useState("")
  const [runB, setRunB] = useState("")
  const [compared, setCompared] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")

  function handleCompare() {
    if (runA && runB && runA !== runB) {
      setCompared(true)
      setActiveTab("summary")
    }
  }

  const addedCount = mockAdded.length
  const removedCount = mockRemoved.length
  const changedCount = new Set(mockChanged.map((c) => c.name)).size
  const totalChanges = addedCount + removedCount + changedCount

  const maxBar = Math.max(addedCount, removedCount, changedCount)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Compare Runs
        </h1>
        <p className="text-muted-foreground mt-1">
          Compare two runs side-by-side to see what changed between extractions.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Run A (Baseline)</label>
              <Select value={runA} onValueChange={setRunA}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a run..." />
                </SelectTrigger>
                <SelectContent>
                  {mockRuns.map((run) => (
                    <SelectItem key={run.id} value={run.id} disabled={run.id === runB}>
                      {run.label} ({run.items} items)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ArrowRight className="size-5 text-muted-foreground shrink-0 hidden sm:block" />

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Run B (Latest)</label>
              <Select value={runB} onValueChange={setRunB}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a run..." />
                </SelectTrigger>
                <SelectContent>
                  {mockRuns.map((run) => (
                    <SelectItem key={run.id} value={run.id} disabled={run.id === runA}>
                      {run.label} ({run.items} items)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCompare}
              disabled={!runA || !runB || runA === runB}
              className="bg-blue-600 hover:bg-blue-700 gap-2 shrink-0"
            >
              <GitCompare className="size-4" />
              Compare
            </Button>
          </div>
        </CardContent>
      </Card>

      {compared && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/15">
                  <Plus className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{addedCount}</p>
                  <p className="text-sm text-muted-foreground">Items Added</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-red-500/15">
                  <Minus className="size-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{removedCount}</p>
                  <p className="text-sm text-muted-foreground">Items Removed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/15">
                  <RefreshCw className="size-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{changedCount}</p>
                  <p className="text-sm text-muted-foreground">Items Changed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-0">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="added" className="gap-1.5">
                    Added
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {addedCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="removed" className="gap-1.5">
                    Removed
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {removedCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="changed" className="gap-1.5">
                    Changed
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {changedCount}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <TabsContent value="summary" className="p-6 pt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-4">Change Distribution</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-emerald-600 font-medium">Added</span>
                          <span className="text-muted-foreground">{addedCount} items</span>
                        </div>
                        <div className="h-6 w-full rounded bg-muted overflow-hidden">
                          <div
                            className="h-full rounded bg-emerald-500 transition-all duration-500"
                            style={{ width: `${(addedCount / maxBar) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-red-600 font-medium">Removed</span>
                          <span className="text-muted-foreground">{removedCount} items</span>
                        </div>
                        <div className="h-6 w-full rounded bg-muted overflow-hidden">
                          <div
                            className="h-full rounded bg-red-500 transition-all duration-500"
                            style={{ width: `${(removedCount / maxBar) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-amber-600 font-medium">Changed</span>
                          <span className="text-muted-foreground">{changedCount} items ({mockChanged.length} fields)</span>
                        </div>
                        <div className="h-6 w-full rounded bg-muted overflow-hidden">
                          <div
                            className="h-full rounded bg-amber-500 transition-all duration-500"
                            style={{ width: `${(changedCount / maxBar) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-sm">
                      <span className="font-medium">{totalChanges} total differences</span>{" "}
                      found between the two runs.{" "}
                      {addedCount > 0 && (
                        <span className="text-emerald-600">{addedCount} new products appeared. </span>
                      )}
                      {removedCount > 0 && (
                        <span className="text-red-600">{removedCount} products were delisted. </span>
                      )}
                      {changedCount > 0 && (
                        <span className="text-amber-600">{changedCount} products had field changes (mostly price drops).</span>
                      )}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="added" className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Reviews</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAdded.map((item) => (
                      <TableRow key={item.name} className="bg-emerald-500/5">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Plus className="size-3.5 text-emerald-600 shrink-0" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-emerald-600 font-medium">
                          {item.price}
                        </TableCell>
                        <TableCell>{item.rating}</TableCell>
                        <TableCell>{item.reviews}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="removed" className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Reviews</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRemoved.map((item) => (
                      <TableRow key={item.name} className="bg-red-500/5">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Minus className="size-3.5 text-red-600 shrink-0" />
                            <span className="font-medium line-through text-muted-foreground">
                              {item.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground line-through">
                          {item.price}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.rating}</TableCell>
                        <TableCell className="text-muted-foreground">{item.reviews}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="changed" className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Field</TableHead>
                      <TableHead>Previous Value</TableHead>
                      <TableHead />
                      <TableHead>New Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockChanged.map((item, i) => (
                      <TableRow key={i} className="bg-amber-500/5">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {item.field}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-red-600 dark:text-red-400 text-sm font-mono">
                            {item.oldValue}
                          </span>
                        </TableCell>
                        <TableCell>
                          <ArrowRight className="size-3.5 text-muted-foreground" />
                        </TableCell>
                        <TableCell>
                          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                            {item.newValue}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </Card>
        </>
      )}
    </div>
  )
}
