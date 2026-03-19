import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Globe, Server, Code2, Layers } from "lucide-react"

const buildInfo = [
  { label: "Framework", value: "Next.js 15.2.8" },
  { label: "React", value: "19" },
  { label: "UI", value: "shadcn/ui (new-york style)" },
  { label: "CSS", value: "Tailwind CSS v4" },
  { label: "Deploy", value: "Vercel (auto from GitHub)" },
  { label: "Repo", value: "github.com/wyatt3d/scraper" },
  { label: "Domain", value: "scraper.bot" },
]

const routeSummary = [
  { label: "Static Pages", value: "~25" },
  { label: "Dynamic Pages", value: "~20" },
  { label: "API Routes", value: "7" },
  { label: "SSG Pages", value: "3" },
  { label: "Middleware", value: "32.8 kB" },
]

const subdomains = [
  { subdomain: "scraper.bot", purpose: "Main site" },
  { subdomain: "admin.scraper.bot", purpose: "Admin panel" },
  { subdomain: "docs.scraper.bot", purpose: "Documentation" },
  { subdomain: "blog.scraper.bot", purpose: "Blog" },
  { subdomain: "status.scraper.bot", purpose: "Status page" },
  { subdomain: "community.scraper.bot", purpose: "Forum" },
  { subdomain: "api.scraper.bot", purpose: "API gateway" },
]

export default function SystemHealthPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">System Health</h1>
        <p className="text-muted-foreground mt-1">Build configuration, routes, and infrastructure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="size-5" />
              Build Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableBody>
                {buildInfo.map((item) => (
                  <TableRow key={item.label}>
                    <TableCell className="text-sm font-medium">{item.label}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="size-5" />
              Route Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableBody>
                {routeSummary.map((item) => (
                  <TableRow key={item.label}>
                    <TableCell className="text-sm font-medium">{item.label}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="size-5" />
            Subdomains
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subdomain</TableHead>
                <TableHead>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subdomains.map((s) => (
                <TableRow key={s.subdomain}>
                  <TableCell className="font-mono text-sm">{s.subdomain}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
