"use client"

import { useState } from "react"
import {
  Eye,
  EyeOff,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Shield,
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
import { Textarea } from "@/components/ui/textarea"
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
import { toast } from "sonner"

interface Secret {
  id: string
  name: string
  type: string
  value: string
  description: string
  createdAt: string
  lastUsed: string
  referencedBy: string[]
}

const initialSecrets: Secret[] = [
  {
    id: "sec-1",
    name: "SLACK_WEBHOOK_URL",
    type: "Webhook",
    value: "https://hooks.example.slack/services/TXXXXXXXX/BXXXXXXXX/placeholder",
    description: "Slack notifications channel",
    createdAt: "Mar 15",
    lastUsed: "2 hours ago",
    referencedBy: ["Product Monitor", "Alerts"],
  },
  {
    id: "sec-2",
    name: "GOOGLE_SHEETS_TOKEN",
    type: "OAuth Token",
    value: "ya29.a0AfB_byBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    description: "Google Sheets API access",
    createdAt: "Mar 10",
    lastUsed: "1 day ago",
    referencedBy: ["Job Scraper"],
  },
  {
    id: "sec-3",
    name: "SMTP_PASSWORD",
    type: "Password",
    value: "s3cur3P@ssw0rd!2026",
    description: "SMTP email password",
    createdAt: "Mar 1",
    lastUsed: "3 days ago",
    referencedBy: ["Email Alerts"],
  },
  {
    id: "sec-4",
    name: "PROXY_AUTH_KEY",
    type: "API Key",
    value: "prx_auth_k8m2n4p6q9r1s3t5u7w0y2z4a6b8c0d2",
    description: "Proxy authentication key",
    createdAt: "Feb 28",
    lastUsed: "1 hour ago",
    referencedBy: ["All flows"],
  },
]

const SECRET_TYPES = ["API Key", "Password", "OAuth Token", "Webhook URL", "Custom"]

function toUpperSnakeCase(str: string) {
  return str
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_{2,}/g, "_")
    .toUpperCase()
}

export default function SecretsPage() {
  const [secrets, setSecrets] = useState<Secret[]>(initialSecrets)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState("")
  const [newValue, setNewValue] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [valueRevealed, setValueRevealed] = useState(false)
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set())

  function resetForm() {
    setNewName("")
    setNewType("")
    setNewValue("")
    setNewDescription("")
    setValueRevealed(false)
  }

  function addSecret() {
    const secret: Secret = {
      id: `sec-${Date.now()}`,
      name: newName,
      type: newType,
      value: newValue,
      description: newDescription,
      createdAt: "Just now",
      lastUsed: "Never",
      referencedBy: [],
    }
    setSecrets((prev) => [...prev, secret])
    setDialogOpen(false)
    resetForm()
    toast.success(`Secret "${newName}" added`)
  }

  function deleteSecret(id: string, name: string) {
    setSecrets((prev) => prev.filter((s) => s.id !== id))
    toast.success(`Secret "${name}" deleted`)
  }

  function refreshSecret(name: string) {
    toast.success(`Secret "${name}" refreshed`)
  }

  function toggleReveal(id: string) {
    setRevealedSecrets((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function maskValue(value: string) {
    if (value.length <= 8) return "*".repeat(value.length)
    return value.slice(0, 4) + "*".repeat(Math.min(value.length - 8, 32)) + value.slice(-4)
  }

  const isValidName = /^[A-Z][A-Z0-9_]*$/.test(newName)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Secrets & Environment Variables
          </h1>
          <p className="text-muted-foreground mt-1">
            Store sensitive values that your flows can reference securely. Secrets are encrypted at rest with AES-256.
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              Add Secret
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Secret</DialogTitle>
              <DialogDescription>
                Create a new encrypted secret for use in your flows.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., MY_API_KEY"
                  value={newName}
                  onChange={(e) => setNewName(toUpperSnakeCase(e.target.value))}
                />
                {newName && !isValidName && (
                  <p className="text-xs text-red-500">Must be UPPER_SNAKE_CASE (letters, digits, underscores)</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECRET_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="relative">
                  <Textarea
                    placeholder="Enter secret value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="pr-10 font-mono text-sm"
                    style={!valueRevealed ? { WebkitTextSecurity: "disc" } as React.CSSProperties : undefined}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 size-7"
                    aria-label={valueRevealed ? "Hide secret value" : "Reveal secret value"}
                    onClick={() => setValueRevealed(!valueRevealed)}
                    type="button"
                  >
                    {valueRevealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Input
                  placeholder="What is this secret used for?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 rounded-md border border-emerald-500/25 bg-emerald-500/5 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                <Shield className="size-4 shrink-0" />
                AES-256 encrypted at rest
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={addSecret}
                disabled={!newName || !isValidName || !newType || !newValue}
              >
                Add Secret
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Referenced By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {secrets.map((secret) => (
                <TableRow key={secret.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Lock className="size-4 text-muted-foreground" />
                      <code className="text-sm font-mono font-medium">{secret.name}</code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{secret.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{secret.createdAt}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{secret.lastUsed}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {secret.referencedBy.map((ref) => (
                        <Badge key={ref} variant="outline" className="text-xs">{ref}</Badge>
                      ))}
                      {secret.referencedBy.length === 0 && (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {secret.type === "OAuth Token" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label={`Refresh ${secret.name}`}
                          onClick={() => refreshSecret(secret.name)}
                        >
                          <RefreshCw className="size-3.5" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label={`Edit ${secret.name}`}
                          onClick={() => toast.info(`Editing "${secret.name}"`)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-red-500 hover:text-red-600"
                            aria-label={`Delete ${secret.name}`}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Secret</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{secret.name}&quot;? Any flows
                              referencing this secret will fail. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteSecret(secret.id, secret.name)}
                            >
                              Delete Secret
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {secrets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No secrets configured. Add one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage in Flows</CardTitle>
          <CardDescription>
            Reference secrets in your flow steps using the double-brace syntax
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted/50 p-4 space-y-3">
            <p className="text-sm font-medium">Reference syntax:</p>
            <code className="block text-sm font-mono bg-background rounded px-3 py-2 border">
              {"{{secrets.SLACK_WEBHOOK_URL}}"}
            </code>
          </div>
          <div className="rounded-md border bg-muted/50 p-4 space-y-3">
            <p className="text-sm font-medium">Example: Send Slack notification in a flow step</p>
            <pre className="text-sm font-mono bg-background rounded px-3 py-2 border overflow-x-auto">{`{
  "action": "webhook",
  "url": "{{secrets.SLACK_WEBHOOK_URL}}",
  "method": "POST",
  "body": {
    "text": "New data extracted: {{results.count}} items"
  }
}`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
