"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Copy, Clock } from "lucide-react"

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DAY_FULL = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

interface CronFields {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

const PRESETS: { label: string; cron: string }[] = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every Monday at 9am", cron: "0 9 * * 1" },
  { label: "Weekdays at 6pm", cron: "0 18 * * 1-5" },
]

function parseCronField(
  field: string,
  min: number,
  max: number
): number[] | null {
  if (field === "*") return null // means all
  const values: number[] = []
  const parts = field.split(",")
  for (const part of parts) {
    if (part.includes("/")) {
      const [range, stepStr] = part.split("/")
      const step = parseInt(stepStr, 10)
      if (isNaN(step) || step <= 0) return []
      const start = range === "*" ? min : parseInt(range, 10)
      if (isNaN(start)) return []
      for (let i = start; i <= max; i += step) {
        values.push(i)
      }
    } else if (part.includes("-")) {
      const [startStr, endStr] = part.split("-")
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      if (isNaN(start) || isNaN(end)) return []
      for (let i = start; i <= end; i++) {
        values.push(i)
      }
    } else {
      const val = parseInt(part, 10)
      if (isNaN(val)) return []
      values.push(val)
    }
  }
  return values.length > 0 ? [...new Set(values)].sort((a, b) => a - b) : []
}

function getNextRuns(cronExpr: string, count: number): Date[] {
  const parts = cronExpr.trim().split(/\s+/)
  if (parts.length !== 5) return []

  const minutes = parseCronField(parts[0], 0, 59)
  const hours = parseCronField(parts[1], 0, 23)
  const daysOfMonth = parseCronField(parts[2], 1, 31)
  const months = parseCronField(parts[3], 1, 12)
  const daysOfWeek = parseCronField(parts[4], 0, 7) // 0 and 7 are Sunday

  const results: Date[] = []
  const now = new Date()
  const candidate = new Date(now)
  candidate.setSeconds(0, 0)
  candidate.setMinutes(candidate.getMinutes() + 1)

  const maxIterations = 525600 // 1 year of minutes
  for (let i = 0; i < maxIterations && results.length < count; i++) {
    const m = candidate.getMinutes()
    const h = candidate.getHours()
    const dom = candidate.getDate()
    const mon = candidate.getMonth() + 1
    let dow = candidate.getDay() // 0=Sunday
    if (dow === 0) dow = 7 // normalize to 1-7 for matching, but keep 0 for cron compat

    const minuteMatch = minutes === null || minutes.includes(m)
    const hourMatch = hours === null || hours.includes(h)
    const domMatch = daysOfMonth === null || daysOfMonth.includes(dom)
    const monthMatch = months === null || months.includes(mon)
    const dowMatch =
      daysOfWeek === null ||
      daysOfWeek.includes(candidate.getDay()) ||
      (candidate.getDay() === 0 && daysOfWeek.includes(7)) ||
      (dow === 7 && daysOfWeek.includes(0))

    if (minuteMatch && hourMatch && domMatch && monthMatch && dowMatch) {
      results.push(new Date(candidate))
    }

    candidate.setMinutes(candidate.getMinutes() + 1)
  }

  return results
}

function describeField(
  value: string,
  unit: string,
  names?: string[]
): string {
  if (value === "*") return ""
  if (value.startsWith("*/")) {
    const n = value.slice(2)
    return `every ${n} ${unit}${parseInt(n) !== 1 ? "s" : ""}`
  }
  if (names && !value.includes("/") && !value.includes("-")) {
    const idx = parseInt(value, 10)
    if (!isNaN(idx) && idx >= 0 && idx < names.length) {
      return names[idx]
    }
  }
  return value
}

function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return "Invalid cron expression"
  const [min, hr, dom, mon, dow] = parts

  if (cron === "* * * * *") return "Runs every minute"
  if (min.startsWith("*/") && hr === "*" && dom === "*" && mon === "*" && dow === "*") {
    return `Runs every ${min.slice(2)} minutes`
  }
  if (min !== "*" && hr === "*" && dom === "*" && mon === "*" && dow === "*") {
    return `Runs at minute ${min} of every hour`
  }

  const pieces: string[] = ["Runs"]

  // Time
  if (min !== "*" && hr !== "*" && !min.startsWith("*/") && !hr.startsWith("*/")) {
    const h = parseInt(hr, 10)
    const m = parseInt(min, 10)
    if (!isNaN(h) && !isNaN(m)) {
      const ampm = h >= 12 ? "PM" : "AM"
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      pieces.push(`at ${h12}:${m.toString().padStart(2, "0")} ${ampm}`)
    } else {
      pieces.push(`at ${hr}:${min}`)
    }
  } else {
    if (min !== "*" && min.startsWith("*/")) {
      pieces.push(describeField(min, "minute"))
    }
    if (hr !== "*" && hr.startsWith("*/")) {
      pieces.push(describeField(hr, "hour"))
    }
  }

  // Day of week
  if (dow !== "*") {
    if (dow === "1-5") {
      pieces.push("on weekdays")
    } else if (dow === "0,6" || dow === "6,0") {
      pieces.push("on weekends")
    } else {
      const dayIdx = parseInt(dow, 10)
      if (!isNaN(dayIdx)) {
        const name = dayIdx === 0 || dayIdx === 7 ? "Sunday" : DAY_FULL[dayIdx - 1]
        if (name) pieces.push(`every ${name}`)
      } else {
        pieces.push(`on days ${dow}`)
      }
    }
  }

  // Day of month
  if (dom !== "*") {
    pieces.push(`on day ${dom} of the month`)
  }

  // Month
  if (mon !== "*") {
    const monthIdx = parseInt(mon, 10)
    if (!isNaN(monthIdx) && monthIdx >= 1 && monthIdx <= 12) {
      pieces.push(`in ${MONTH_NAMES[monthIdx - 1]}`)
    } else {
      pieces.push(`in month ${mon}`)
    }
  }

  return pieces.join(" ")
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export default function CronBuilderPage() {
  const [fields, setFields] = useState<CronFields>({
    minute: "*/5",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  })
  const [copied, setCopied] = useState(false)

  const cronExpression = `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`

  const nextRuns = useMemo(() => getNextRuns(cronExpression, 5), [cronExpression])
  const description = useMemo(() => describeCron(cronExpression), [cronExpression])

  const applyPreset = useCallback((cron: string) => {
    const parts = cron.split(" ")
    setFields({
      minute: parts[0],
      hour: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4],
    })
  }, [])

  const updateField = useCallback(
    (field: keyof CronFields, value: string) => {
      setFields((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cronExpression)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = cronExpression
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [cronExpression])

  const [minuteMode, setMinuteMode] = useState("every-5")
  const [hourMode, setHourMode] = useState("every")
  const [domMode, setDomMode] = useState("every")
  const [monthMode, setMonthMode] = useState("every")
  const [dowMode, setDowMode] = useState("every")
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const handleMinuteMode = useCallback(
    (mode: string) => {
      setMinuteMode(mode)
      const map: Record<string, string> = {
        every: "*",
        "every-5": "*/5",
        "every-15": "*/15",
        "every-30": "*/30",
      }
      if (map[mode]) updateField("minute", map[mode])
    },
    [updateField]
  )

  const handleHourMode = useCallback(
    (mode: string) => {
      setHourMode(mode)
      const map: Record<string, string> = {
        every: "*",
        "every-2": "*/2",
        "every-6": "*/6",
        "every-12": "*/12",
      }
      if (map[mode]) updateField("hour", map[mode])
    },
    [updateField]
  )

  const handleDomMode = useCallback(
    (mode: string) => {
      setDomMode(mode)
      const map: Record<string, string> = {
        every: "*",
        "1st": "1",
        "15th": "15",
      }
      if (map[mode]) updateField("dayOfMonth", map[mode])
    },
    [updateField]
  )

  const handleMonthMode = useCallback(
    (mode: string) => {
      setMonthMode(mode)
      if (mode === "every") updateField("month", "*")
    },
    [updateField]
  )

  const handleDowMode = useCallback(
    (mode: string) => {
      setDowMode(mode)
      setSelectedDays([])
      const map: Record<string, string> = {
        every: "*",
        weekdays: "1-5",
        weekends: "0,6",
      }
      if (map[mode]) updateField("dayOfWeek", map[mode])
    },
    [updateField]
  )

  const toggleDay = useCallback(
    (dayNum: number) => {
      setSelectedDays((prev) => {
        const next = prev.includes(dayNum)
          ? prev.filter((d) => d !== dayNum)
          : [...prev, dayNum].sort((a, b) => a - b)
        if (next.length === 0) {
          updateField("dayOfWeek", "*")
          setDowMode("every")
        } else {
          updateField("dayOfWeek", next.join(","))
        }
        return next
      })
    },
    [updateField]
  )

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <Link
              href="/tools"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              All Tools
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              Cron Expression Builder
            </h1>
            <Badge variant="secondary" className="text-xs">
              Free Tool by Scraper.bot
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Build cron expressions visually and see the next scheduled runs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Presets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Quick Presets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset.cron}
                    size="sm"
                    variant={
                      cronExpression === preset.cron ? "default" : "outline"
                    }
                    onClick={() => applyPreset(preset.cron)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Builder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Build Expression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Minute */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium w-28 shrink-0">
                  Minute
                </span>
                <Select value={minuteMode} onValueChange={handleMinuteMode}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="every">Every minute</SelectItem>
                    <SelectItem value="every-5">Every 5 minutes</SelectItem>
                    <SelectItem value="every-15">Every 15 minutes</SelectItem>
                    <SelectItem value="every-30">Every 30 minutes</SelectItem>
                    <SelectItem value="specific">Specific</SelectItem>
                  </SelectContent>
                </Select>
                {minuteMode === "specific" && (
                  <Input
                    className="w-24 font-mono text-sm"
                    placeholder="0-59"
                    value={fields.minute === "*" || fields.minute.startsWith("*/") ? "" : fields.minute}
                    onChange={(e) => updateField("minute", e.target.value || "*")}
                  />
                )}
              </div>

              {/* Hour */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium w-28 shrink-0">Hour</span>
                <Select value={hourMode} onValueChange={handleHourMode}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="every">Every hour</SelectItem>
                    <SelectItem value="every-2">Every 2 hours</SelectItem>
                    <SelectItem value="every-6">Every 6 hours</SelectItem>
                    <SelectItem value="every-12">Every 12 hours</SelectItem>
                    <SelectItem value="specific">Specific</SelectItem>
                  </SelectContent>
                </Select>
                {hourMode === "specific" && (
                  <Input
                    className="w-24 font-mono text-sm"
                    placeholder="0-23"
                    value={fields.hour === "*" || fields.hour.startsWith("*/") ? "" : fields.hour}
                    onChange={(e) => updateField("hour", e.target.value || "*")}
                  />
                )}
              </div>

              {/* Day of Month */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium w-28 shrink-0">
                  Day of Month
                </span>
                <Select value={domMode} onValueChange={handleDomMode}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="every">Every day</SelectItem>
                    <SelectItem value="1st">1st of month</SelectItem>
                    <SelectItem value="15th">15th of month</SelectItem>
                    <SelectItem value="specific">Specific</SelectItem>
                  </SelectContent>
                </Select>
                {domMode === "specific" && (
                  <Input
                    className="w-24 font-mono text-sm"
                    placeholder="1-31"
                    value={fields.dayOfMonth === "*" ? "" : fields.dayOfMonth}
                    onChange={(e) =>
                      updateField("dayOfMonth", e.target.value || "*")
                    }
                  />
                )}
              </div>

              {/* Month */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium w-28 shrink-0">
                  Month
                </span>
                <Select value={monthMode} onValueChange={handleMonthMode}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="every">Every month</SelectItem>
                    <SelectItem value="specific">Specific</SelectItem>
                  </SelectContent>
                </Select>
                {monthMode === "specific" && (
                  <Input
                    className="w-32 font-mono text-sm"
                    placeholder="1-12 or 1,6"
                    value={fields.month === "*" ? "" : fields.month}
                    onChange={(e) =>
                      updateField("month", e.target.value || "*")
                    }
                  />
                )}
              </div>

              {/* Day of Week */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <span className="text-sm font-medium w-28 shrink-0 mt-2">
                  Day of Week
                </span>
                <div className="space-y-2">
                  <Select value={dowMode} onValueChange={handleDowMode}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="every">Every day</SelectItem>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="specific">Specific</SelectItem>
                    </SelectContent>
                  </Select>
                  {dowMode === "specific" && (
                    <div className="flex gap-1.5">
                      {DAY_NAMES.map((day, i) => {
                        const cronDay = i + 1 // Mon=1 ... Sun=7
                        return (
                          <Button
                            key={day}
                            size="sm"
                            variant={
                              selectedDays.includes(cronDay)
                                ? "default"
                                : "outline"
                            }
                            className="w-10 h-8 text-xs"
                            onClick={() => toggleDay(cronDay)}
                          >
                            {day}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Expression */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Generated Expression
                  </p>
                  <p className="font-mono text-2xl font-bold tracking-wider">
                    {cronExpression}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Runs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Next 5 Scheduled Runs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextRuns.length > 0 ? (
                <ol className="space-y-2">
                  {nextRuns.map((run, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-mono"
                    >
                      <span className="text-muted-foreground w-4 text-right">
                        {i + 1}.
                      </span>
                      <span>{formatDate(run)}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Could not calculate next runs. Check the expression.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Schedule your scrapers with{" "}
            <span className="font-serif font-semibold">
              Scraper<span className="text-blue-600">.bot</span>
            </span>
          </p>
          <Link href="/pricing">
            <Button variant="default">
              Automate your scraping schedule
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
