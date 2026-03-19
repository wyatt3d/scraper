"use client"

import { useState } from "react"
import {
  Globe,
  Radio,
  Shield,
  Timer,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

const bandwidthData = [
  { flow: "Amazon Product Monitor", bandwidth: "4.2 GB", requests: "12,400", avgSize: "340 KB" },
  { flow: "Craigslist Cars", bandwidth: "3.1 GB", requests: "8,200", avgSize: "380 KB" },
  { flow: "LinkedIn Job Scraper", bandwidth: "2.8 GB", requests: "6,100", avgSize: "460 KB" },
  { flow: "News Aggregator", bandwidth: "1.5 GB", requests: "4,800", avgSize: "310 KB" },
  { flow: "Zillow Listings", bandwidth: "0.8 GB", requests: "2,100", avgSize: "390 KB" },
]

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
  { value: "fr", label: "France" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "br", label: "Brazil" },
  { value: "in", label: "India" },
  { value: "kr", label: "South Korea" },
]

export default function ProxiesPage() {
  const [proxyType, setProxyType] = useState<"residential" | "datacenter">("residential")
  const [proxyMode, setProxyMode] = useState("auto")
  const [country, setCountry] = useState("us")
  const [city, setCity] = useState("")
  const [rotation, setRotation] = useState("per-request")
  const [stickyDuration, setStickyDuration] = useState("30")
  const [concurrent, setConcurrent] = useState([25])

  function saveConfig() {
    toast.success("Proxy configuration saved")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Proxy Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Route your scraping traffic through residential or datacenter proxies for reliable access
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={proxyType === "residential" ? "default" : "ghost"}
            size="sm"
            onClick={() => setProxyType("residential")}
          >
            Residential
          </Button>
          <Button
            variant={proxyType === "datacenter" ? "default" : "ghost"}
            size="sm"
            onClick={() => setProxyType("datacenter")}
          >
            Datacenter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Radio className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-xs text-muted-foreground">Active Proxies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Globe className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">195</p>
                <p className="text-xs text-muted-foreground">Countries Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Timer className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">340ms</p>
                <p className="text-xs text-muted-foreground">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Zap className="size-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">99.2%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuration</CardTitle>
          <CardDescription>
            Customize proxy behavior for your {proxyType} proxy pool
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Proxy Mode</Label>
              <Select value={proxyMode} onValueChange={setProxyMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (recommended)</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="datacenter">Datacenter</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Geo-targeting: Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>City (optional)</Label>
              <Input
                placeholder="e.g., New York, London"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rotation</Label>
              <Select value={rotation} onValueChange={setRotation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per-request">Per-request</SelectItem>
                  <SelectItem value="per-session">Per-session</SelectItem>
                  <SelectItem value="sticky">Sticky</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {rotation === "sticky" && (
            <div className="space-y-2">
              <Label>Sticky Duration (minutes)</Label>
              <Input
                type="number"
                placeholder="30"
                value={stickyDuration}
                onChange={(e) => setStickyDuration(e.target.value)}
                className="max-w-[200px]"
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Concurrent Connections</Label>
              <span className="text-sm font-mono text-muted-foreground">{concurrent[0]}</span>
            </div>
            <Slider
              value={concurrent}
              onValueChange={setConcurrent}
              min={1}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>100</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveConfig}>Save Configuration</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bandwidth Usage</CardTitle>
          <CardDescription>Current billing period usage breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Current Period</span>
              <span className="text-muted-foreground">12.4 GB / 50 GB</span>
            </div>
            <Progress value={24.8} className="h-2" />
            <p className="text-xs text-muted-foreground">37.6 GB remaining. Resets on Apr 1, 2026.</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow</TableHead>
                <TableHead>Bandwidth</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Avg Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bandwidthData.map((row) => (
                <TableRow key={row.flow}>
                  <TableCell className="font-medium">{row.flow}</TableCell>
                  <TableCell className="text-muted-foreground">{row.bandwidth}</TableCell>
                  <TableCell className="text-muted-foreground">{row.requests}</TableCell>
                  <TableCell className="text-muted-foreground">{row.avgSize}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
