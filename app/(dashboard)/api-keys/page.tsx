"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  Plus,
  Trash2,
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockApiKeys } from "@/lib/mock-data"
import type { ApiKey } from "@/lib/types"

const ALL_SCOPES = [
  "flows:read",
  "flows:write",
  "runs:read",
  "runs:write",
  "extract:execute",
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date("2026-03-18T18:30:00Z")
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function generateKey() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = "scr_live_"
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function maskKey(key: string, prefix: string) {
  return prefix + "*".repeat(key.length - prefix.length - 4) + key.slice(-4)
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(mockApiKeys)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>([])
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())

  function createKey() {
    const key = generateKey()
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key,
      prefix: "scr_live_",
      createdAt: new Date().toISOString(),
      scopes: newKeyScopes,
    }
    setKeys((prev) => [...prev, newKey])
    setGeneratedKey(key)
  }

  function revokeKey(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id))
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function toggleScope(scope: string) {
    setNewKeyScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    )
  }

  function toggleRevealKey(id: string) {
    setRevealedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function resetCreateDialog() {
    setNewKeyName("")
    setNewKeyScopes([])
    setGeneratedKey(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            API Keys
          </h1>
          <p className="text-muted-foreground mt-1">
            Use API keys to authenticate requests to the Scraper API.
          </p>
        </div>
        <Dialog
          open={createDialogOpen}
          onOpenChange={(open) => {
            setCreateDialogOpen(open)
            if (!open) resetCreateDialog()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {generatedKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>API Key Created</DialogTitle>
                  <DialogDescription>
                    Copy your API key now. You will not be able to see it again.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
                    <code className="flex-1 break-all text-sm font-mono">
                      {generatedKey}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={() => copyToClipboard(generatedKey, "new-key")}
                    >
                      {copiedId === "new-key" ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="rounded-md border border-amber-500/25 bg-amber-500/5 p-3 text-xs text-amber-600 dark:text-amber-400">
                    Store this key securely. It will only be shown once and cannot be retrieved later.
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setCreateDialogOpen(false)}>Done</Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Generate a new API key with specific permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="e.g., Production API Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Scopes</Label>
                    {ALL_SCOPES.map((scope) => (
                      <div key={scope} className="flex items-center gap-2">
                        <Checkbox
                          id={scope}
                          checked={newKeyScopes.includes(scope)}
                          onCheckedChange={() => toggleScope(scope)}
                        />
                        <label
                          htmlFor={scope}
                          className="text-sm font-mono cursor-pointer"
                        >
                          {scope}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={createKey}
                    disabled={!newKeyName || newKeyScopes.length === 0}
                  >
                    Create Key
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Key className="size-4 text-muted-foreground" />
                      <span className="font-medium">{apiKey.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs font-mono text-muted-foreground">
                        {revealedKeys.has(apiKey.id)
                          ? apiKey.key
                          : maskKey(apiKey.key, apiKey.prefix)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => toggleRevealKey(apiKey.id)}
                      >
                        {revealedKeys.has(apiKey.id) ? (
                          <EyeOff className="size-3" />
                        ) : (
                          <Eye className="size-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(apiKey.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {apiKey.lastUsedAt
                      ? formatRelativeTime(apiKey.lastUsedAt)
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.scopes.map((scope) => (
                        <Badge
                          key={scope}
                          variant="secondary"
                          className="text-xs font-mono"
                        >
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                      >
                        {copiedId === apiKey.id ? (
                          <Check className="size-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to revoke &quot;{apiKey.name}&quot;? Any
                              applications using this key will immediately lose
                              access. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => revokeKey(apiKey.id)}
                            >
                              Revoke Key
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {keys.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No API keys. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Documentation</CardTitle>
          <CardDescription>
            Learn how to use the Scraper API to create flows, trigger runs, and
            extract structured data programmatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href="/docs/api" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" />
              View API Docs
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
