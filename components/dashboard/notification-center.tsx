"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  Key,
  MessageSquare,
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

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info" | "security" | "community"
  message: string
  timestamp: string
  read: boolean
  href: string
}

const initialNotifications: Notification[] = [
  {
    id: "n-1",
    type: "success",
    message: "Product Price Monitor completed - 147 items extracted",
    timestamp: "2 min ago",
    read: false,
    href: "/runs",
  },
  {
    id: "n-2",
    type: "error",
    message: "Craigslist Cars Aggregator failed - Rate limited",
    timestamp: "30 min ago",
    read: false,
    href: "/runs",
  },
  {
    id: "n-3",
    type: "info",
    message: "5 new auction listings detected",
    timestamp: "2 hours ago",
    read: false,
    href: "/monitoring",
  },
  {
    id: "n-4",
    type: "security",
    message: "API key 'Production' was used from new IP",
    timestamp: "5 hours ago",
    read: true,
    href: "/api-keys",
  },
  {
    id: "n-5",
    type: "warning",
    message: "Your usage is at 75% of monthly limit",
    timestamp: "1 day ago",
    read: true,
    href: "/settings",
  },
  {
    id: "n-6",
    type: "community",
    message: "New community reply on your post",
    timestamp: "2 days ago",
    read: true,
    href: "/settings",
  },
]

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  security: Key,
  community: MessageSquare,
}

const iconColorMap = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  security: "text-orange-500",
  community: "text-violet-500",
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [open, setOpen] = useState(false)

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
            {notifications.map((n) => {
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
            })}
          </div>
        </ScrollArea>
        <div className="border-t px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            asChild
          >
            <Link href="/settings" onClick={() => setOpen(false)}>
              View all notifications
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
