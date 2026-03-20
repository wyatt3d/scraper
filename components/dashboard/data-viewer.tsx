"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Copy, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const RechartsBar = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false }
)
const RechartsBarComponent: any = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Bar as any })),
  { ssr: false }
)
const RechartsXAxis: any = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.XAxis as any })),
  { ssr: false }
)
const RechartsYAxis: any = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.YAxis as any })),
  { ssr: false }
)
const RechartsTooltip: any = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Tooltip as any })),
  { ssr: false }
)
const RechartsResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)
const RechartsCartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
)

interface DataViewerProps {
  data: Record<string, unknown>[]
  schema?: Record<string, string>
}

type SortDirection = "asc" | "desc" | null

const ITEMS_PER_PAGE = 10

function inferType(values: unknown[]): string {
  for (const v of values) {
    if (v == null) continue
    if (typeof v === "number") return "number"
    if (typeof v === "string") {
      if (/^https?:\/\//.test(v)) return "url"
      if (!isNaN(Date.parse(v)) && /\d{4}-\d{2}/.test(v)) return "date"
    }
    return "text"
  }
  return "text"
}

function inferSchema(data: Record<string, unknown>[]): Record<string, string> {
  if (data.length === 0) return {}
  const keys = Object.keys(data[0])
  const result: Record<string, string> = {}
  for (const key of keys) {
    const values = data.map((row) => row[key])
    result[key] = inferType(values)
  }
  return result
}

function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    text: "bg-muted text-muted-foreground",
    number: "bg-muted text-foreground",
    date: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    url: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  }
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] px-1.5 py-0 font-normal border-0 ml-1",
        styles[type] || styles.text
      )}
    >
      {type}
    </Badge>
  )
}

export function DataViewer({ data, schema }: DataViewerProps) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedColumn, setSelectedColumn] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const resolvedSchema = useMemo(
    () => schema || inferSchema(data),
    [data, schema]
  )
  const columns = useMemo(() => Object.keys(resolvedSchema), [resolvedSchema])
  const numericColumns = useMemo(
    () => columns.filter((c) => resolvedSchema[c] === "number"),
    [columns, resolvedSchema]
  )

  const activeChartColumn = selectedColumn || numericColumns[0] || ""

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter((row) =>
      columns.some((col) => String(row[col] ?? "").toLowerCase().includes(q))
    )
  }, [data, search, columns])

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal
      }
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc")
      else if (sortDir === "desc") {
        setSortKey(null)
        setSortDir(null)
      }
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
    setPage(1)
  }

  function SortIcon({ col }: { col: string }) {
    if (sortKey !== col) return <ArrowUpDown className="size-3 opacity-40" />
    if (sortDir === "asc") return <ArrowUp className="size-3" />
    return <ArrowDown className="size-3" />
  }

  const chartStats = useMemo(() => {
    if (!activeChartColumn) return null
    const nums = data
      .map((r) => r[activeChartColumn])
      .filter((v): v is number => typeof v === "number")
    if (nums.length === 0) return null
    return {
      min: Math.min(...nums),
      max: Math.max(...nums),
      avg: nums.reduce((s, n) => s + n, 0) / nums.length,
      median: median(nums),
    }
  }, [data, activeChartColumn])

  async function handleCopy() {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border bg-background p-8 text-sm text-muted-foreground">
        No output data available
      </div>
    )
  }

  return (
    <Tabs defaultValue="table" className="w-full">
      <TabsList>
        <TabsTrigger value="table">Table View</TabsTrigger>
        <TabsTrigger value="chart">Chart View</TabsTrigger>
        <TabsTrigger value="json">Raw JSON</TabsTrigger>
      </TabsList>

      <TabsContent value="table" className="mt-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter rows..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-8 h-8 text-xs"
            />
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            Showing {paginated.length} of {filtered.length} items
          </Badge>
        </div>

        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col}
                    className={cn(
                      "cursor-pointer select-none whitespace-nowrap",
                      resolvedSchema[col] === "number" && "text-right"
                    )}
                    onClick={() => handleSort(col)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col}
                      <TypeBadge type={resolvedSchema[col]} />
                      <SortIcon col={col} />
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => {
                    const val = row[col]
                    const type = resolvedSchema[col]
                    return (
                      <TableCell
                        key={col}
                        className={cn(
                          "text-xs",
                          type === "number" && "text-right font-mono"
                        )}
                      >
                        {type === "url" && typeof val === "string" ? (
                          <a
                            href={val}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400 truncate block max-w-[200px]"
                            title={val}
                          >
                            {val}
                          </a>
                        ) : (
                          String(val ?? "--")
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="chart" className="mt-3">
        {numericColumns.length === 0 ? (
          <div className="flex items-center justify-center rounded-md border bg-background p-8 text-sm text-muted-foreground">
            No numeric columns detected for charting.
          </div>
        ) : (
          <>
            <div className="mb-3">
              <Select
                value={activeChartColumn}
                onValueChange={setSelectedColumn}
              >
                <SelectTrigger className="w-[200px] h-8 text-xs">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border bg-background p-4">
              <div className="h-[250px] w-full">
                <RechartsResponsiveContainer width="100%" height="100%">
                  <RechartsBar data={data}>
                    <RechartsCartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <RechartsXAxis
                      dataKey={columns.find(
                        (c) => resolvedSchema[c] === "text"
                      ) || columns[0]}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsYAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                      }}
                    />
                    <RechartsBarComponent
                      dataKey={activeChartColumn}
                      fill="hsl(221, 83%, 53%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBar>
                </RechartsResponsiveContainer>
              </div>
            </div>

            {chartStats && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {[
                  { label: "Min", value: chartStats.min },
                  { label: "Max", value: chartStats.max },
                  { label: "Avg", value: chartStats.avg },
                  { label: "Median", value: chartStats.median },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-md border bg-background p-3 text-center"
                  >
                    <p className="text-[10px] uppercase text-muted-foreground tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-sm font-mono font-semibold mt-0.5">
                      {typeof stat.value === "number"
                        ? Number.isInteger(stat.value)
                          ? stat.value.toLocaleString()
                          : stat.value.toFixed(2)
                        : "--"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="json" className="mt-3">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 h-7 text-xs gap-1 z-10"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="size-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3" />
                Copy
              </>
            )}
          </Button>
          <pre className="overflow-auto rounded-md border bg-zinc-950 text-zinc-100 p-4 text-xs leading-relaxed max-h-[400px]">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  )
}
