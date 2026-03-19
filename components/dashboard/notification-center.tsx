"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { MonitorAlert } from "@/lib/types"

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
  timestamp: string
  read: boolean
  href: string
}

function alertToNotification(alert: MonitorAlert): Notification {
  const typeMap: Record<MonitorAlert["severity"], Notification["type"]> = {
    critical: "error",
    warning: "warning",
    info: "info",
  }
  return {
    id: alert.id,
    type: typeMap[alert.severity] ?? "info",
    message: `${alert.flowName}: ${alert.message}`,
    timestamp: formatRelativeTime(alert.createdAt),
    read: alert.acknowledged,
    href: `/flows/${alert.flowId}`,
  }
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const iconColorMap = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch("/api/alerts")
        const data = await res.json()
        const alerts: MonitorAlert[] = Array.isArray(data.data) ? data.data : []
        setNotifications(alerts.map(alertToNotification))
      } catch {
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }
    loadAlerts()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground"
              onClick={markAllRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          <div className="divide-y">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = iconMap[n.type]
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => {
                      markRead(n.id)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                      !n.read && "bg-muted/30"
                    )}
                  >
                    <Icon className={cn("size-4 mt-0.5 shrink-0", iconColorMap[n.type])} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{n.message}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {n.timestamp}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </Link>
                )
              })
            )}
          </div>
        </ScrollArea>
        <div className="border-t px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            asChild
          >
            <Link href="/monitoring" onClick={() => setOpen(false)}>
              View all notifications
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
