"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Workflow, Play, Bell, Key, Sparkles, FileText } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
        {actionLabel && actionHref && (
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        )}
        {actionLabel && onAction && !actionHref && (
          <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-700 text-white">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function EmptyFlows() {
  return (
    <EmptyState
      icon={<Workflow className="w-8 h-8 text-muted-foreground" />}
      title="No flows yet"
      description="Create your first flow to start extracting data or automating web interactions. Use our AI-powered builder or start from a template."
      actionLabel="Create Your First Flow"
      actionHref="/flows/new"
    />
  )
}

export function EmptyRuns() {
  return (
    <EmptyState
      icon={<Play className="w-8 h-8 text-muted-foreground" />}
      title="No runs yet"
      description="Runs appear here when you execute a flow. Create a flow first, then run it to see results."
      actionLabel="Go to Flows"
      actionHref="/flows"
    />
  )
}

export function EmptyAlerts() {
  return (
    <EmptyState
      icon={<Bell className="w-8 h-8 text-muted-foreground" />}
      title="No alerts"
      description="When your monitoring flows detect changes or encounter errors, alerts will appear here."
      actionLabel="Set Up Monitoring"
      actionHref="/flows/new"
    />
  )
}

export function EmptyApiKeys() {
  return (
    <EmptyState
      icon={<Key className="w-8 h-8 text-muted-foreground" />}
      title="No API keys"
      description="Create an API key to start making authenticated requests to the Scraper.bot API."
      actionLabel="Create API Key"
    />
  )
}

export function EmptyPlayground() {
  return (
    <EmptyState
      icon={<Sparkles className="w-8 h-8 text-muted-foreground" />}
      title="Start Scraping"
      description="Enter a URL above and describe what you want to extract. Our AI will analyze the page and build an extraction flow for you."
    />
  )
}

export function EmptyTemplates() {
  return (
    <EmptyState
      icon={<FileText className="w-8 h-8 text-muted-foreground" />}
      title="No templates found"
      description="Try adjusting your search or category filter to find templates."
    />
  )
}
