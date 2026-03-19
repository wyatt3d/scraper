"use client"

import { useState } from "react"
import {
  Copy,
  ExternalLink,
  Globe,
  Link2,
  Lock,
  Plus,
  Share2,
  Store,
  Trash2,
  Users,
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
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface SharedWithMe {
  id: string
  flowName: string
  owner: string
  permission: "Can Edit" | "View Only" | "Can Run"
  sharedDate: string
}

interface SharedByMe {
  id: string
  flowName: string
  sharedWith: string
  permission: "Can Edit" | "View Only" | "Can Run"
  sharedDate: string
  isPublicLink: boolean
}

const sharedWithMeData: SharedWithMe[] = [
  {
    id: "sw-1",
    flowName: "Amazon Monitor",
    owner: "Sarah Chen",
    permission: "Can Edit",
    sharedDate: "2 days ago",
  },
  {
    id: "sw-2",
    flowName: "Job Alert Bot",
    owner: "Mike Johnson",
    permission: "View Only",
    sharedDate: "1 week ago",
  },
]

const sharedByMeData: SharedByMe[] = [
  {
    id: "sb-1",
    flowName: "Zillow Tracker",
    sharedWith: "Sarah Chen, Mike",
    permission: "Can Edit",
    sharedDate: "3 days ago",
    isPublicLink: false,
  },
  {
    id: "sb-2",
    flowName: "HN Scraper",
    sharedWith: "Public Link",
    permission: "View Only",
    sharedDate: "1 week ago",
    isPublicLink: true,
  },
]

const availableFlows = [
  { id: "flow-1", name: "Product Price Monitor" },
  { id: "flow-2", name: "Zillow Tracker" },
  { id: "flow-3", name: "HN Scraper" },
  { id: "flow-4", name: "Amazon Monitor" },
  { id: "flow-5", name: "Job Alert Bot" },
]

export default function FlowSharePage() {
  const [withMe, setWithMe] = useState(sharedWithMeData)
  const [byMe, setByMe] = useState(sharedByMeData)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [selectedFlow, setSelectedFlow] = useState("")
  const [shareTab, setShareTab] = useState("team")
  const [teamEmail, setTeamEmail] = useState("")
  const [teamPermission, setTeamPermission] = useState("")
  const [linkPassword, setLinkPassword] = useState("")
  const [linkExpiry, setLinkExpiry] = useState("")
  const [hasPassword, setHasPassword] = useState(false)
  const [mpName, setMpName] = useState("")
  const [mpDescription, setMpDescription] = useState("")
  const [mpCategory, setMpCategory] = useState("")
  const [mpPricing, setMpPricing] = useState("free")
  const [mpPrice, setMpPrice] = useState("")

  const generatedLink = "https://app.scraper.bot/flows/shared/abc123"

  function removeFromSharedWithMe(id: string) {
    setWithMe((prev) => prev.filter((s) => s.id !== id))
    toast.success("Flow removed from shared list")
  }

  function revokeShare(id: string) {
    setByMe((prev) => prev.filter((s) => s.id !== id))
    toast.success("Share access revoked")
  }

  function copyLink() {
    navigator.clipboard.writeText(generatedLink)
    toast.success("Link copied to clipboard")
  }

  function resetForm() {
    setSelectedFlow("")
    setShareTab("team")
    setTeamEmail("")
    setTeamPermission("")
    setLinkPassword("")
    setLinkExpiry("")
    setHasPassword(false)
    setMpName("")
    setMpDescription("")
    setMpCategory("")
    setMpPricing("free")
    setMpPrice("")
  }

  function handleShare() {
    if (!selectedFlow) {
      toast.error("Select a flow to share")
      return
    }

    const flowName =
      availableFlows.find((f) => f.id === selectedFlow)?.name || selectedFlow

    if (shareTab === "team") {
      if (!teamEmail.trim()) {
        toast.error("Enter at least one email address")
        return
      }
      setByMe((prev) => [
        ...prev,
        {
          id: `sb-${Date.now()}`,
          flowName,
          sharedWith: teamEmail,
          permission: (teamPermission as SharedByMe["permission"]) || "View Only",
          sharedDate: "Just now",
          isPublicLink: false,
        },
      ])
      toast.success(`"${flowName}" shared with ${teamEmail}`)
    } else if (shareTab === "link") {
      setByMe((prev) => [
        ...prev,
        {
          id: `sb-${Date.now()}`,
          flowName,
          sharedWith: "Public Link",
          permission: "View Only",
          sharedDate: "Just now",
          isPublicLink: true,
        },
      ])
      navigator.clipboard.writeText(generatedLink)
      toast.success("Public link created and copied to clipboard")
    } else {
      toast.success(`"${flowName}" submitted to marketplace for review`)
    }

    resetForm()
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            Shared Flows
          </h1>
          <p className="text-muted-foreground text-sm">
            Share flows with your team or publish them to the marketplace
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 size-4" />
              Share a Flow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Share Flow</DialogTitle>
              <DialogDescription>
                Share a flow with team members, generate a public link, or
                publish to the marketplace.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Select Flow</Label>
                <Select value={selectedFlow} onValueChange={setSelectedFlow}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a flow" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFlows.map((flow) => (
                      <SelectItem key={flow.id} value={flow.id}>
                        {flow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={shareTab} onValueChange={setShareTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="team" className="flex-1">
                    <Users className="mr-1.5 size-3.5" />
                    Team Members
                  </TabsTrigger>
                  <TabsTrigger value="link" className="flex-1">
                    <Link2 className="mr-1.5 size-3.5" />
                    Public Link
                  </TabsTrigger>
                  <TabsTrigger value="marketplace" className="flex-1">
                    <Store className="mr-1.5 size-3.5" />
                    Marketplace
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="team" className="mt-4 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="team-email">Email Addresses</Label>
                    <Input
                      id="team-email"
                      placeholder="colleague@company.com"
                      value={teamEmail}
                      onChange={(e) => setTeamEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Permission</Label>
                    <Select
                      value={teamPermission}
                      onValueChange={setTeamPermission}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="View Only">View Only</SelectItem>
                        <SelectItem value="Can Edit">Can Edit</SelectItem>
                        <SelectItem value="Can Run">Can Run</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="link" className="mt-4 grid gap-4">
                  <div className="grid gap-2">
                    <Label>Generated Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button variant="outline" size="icon" onClick={copyLink}>
                        <Copy className="size-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Shared flows are viewable at /flows/shared/[id]
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={hasPassword}
                      onCheckedChange={setHasPassword}
                    />
                    <Label>Password protect</Label>
                  </div>
                  {hasPassword && (
                    <div className="grid gap-2">
                      <Label htmlFor="link-password">Password</Label>
                      <Input
                        id="link-password"
                        type="password"
                        placeholder="Set a password"
                        value={linkPassword}
                        onChange={(e) => setLinkPassword(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label>Link Expiry</Label>
                    <Select value={linkExpiry} onValueChange={setLinkExpiry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Never expires" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                        <SelectItem value="7d">7 days</SelectItem>
                        <SelectItem value="30d">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="marketplace" className="mt-4 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mp-name">Listing Name</Label>
                    <Input
                      id="mp-name"
                      placeholder="My Awesome Flow"
                      value={mpName}
                      onChange={(e) => setMpName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mp-desc">Description</Label>
                    <Input
                      id="mp-desc"
                      placeholder="What does this flow do?"
                      value={mpDescription}
                      onChange={(e) => setMpDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select value={mpCategory} onValueChange={setMpCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="jobs">Jobs</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Pricing</Label>
                    <Select value={mpPricing} onValueChange={setMpPricing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                    {mpPricing === "paid" && (
                      <Input
                        placeholder="Price in USD (e.g. 9.99)"
                        value={mpPrice}
                        onChange={(e) => setMpPrice(e.target.value)}
                        className="mt-1"
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={handleShare}>
                <Share2 className="mr-2 size-4" />
                Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shared with Me</CardTitle>
          <CardDescription>Flows that others have shared with you</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Shared Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withMe.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.flowName}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.permission === "Can Edit"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {item.permission}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.sharedDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toast.info(`Opening "${item.flowName}"`)
                        }
                      >
                        <ExternalLink className="mr-1 size-3.5" />
                        Open
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toast.success(`"${item.flowName}" duplicated`)
                        }
                      >
                        <Copy className="mr-1 size-3.5" />
                        Duplicate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromSharedWithMe(item.id)}
                      >
                        <Trash2 className="mr-1 size-3.5" />
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {withMe.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No flows shared with you yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shared by Me</CardTitle>
          <CardDescription>
            Flows you have shared with others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow</TableHead>
                <TableHead>Shared With</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Shared Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byMe.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.flowName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.isPublicLink ? (
                        <Globe className="text-muted-foreground size-3.5" />
                      ) : (
                        <Users className="text-muted-foreground size-3.5" />
                      )}
                      {item.sharedWith}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.permission === "Can Edit"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {item.permission}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.sharedDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {item.isPublicLink ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyLink}
                        >
                          <Copy className="mr-1 size-3.5" />
                          Copy Link
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast.info(`Managing sharing for "${item.flowName}"`)
                          }
                        >
                          <Users className="mr-1 size-3.5" />
                          Manage
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => revokeShare(item.id)}
                      >
                        <Lock className="mr-1 size-3.5" />
                        Revoke
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {byMe.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-8 text-center"
                  >
                    You haven&apos;t shared any flows yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
