"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Globe,
  Plus,
  RefreshCw,
  ShieldCheck,
  Upload,
  X,
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
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

type SsoProvider = "saml" | "oidc" | "google" | null

type VerifiedDomain = {
  domain: string
  status: "verified" | "pending"
  txtRecord: string
}

export default function SsoPage() {
  const [selectedProvider, setSelectedProvider] = useState<SsoProvider>(null)
  const [ssoActive, setSsoActive] = useState(false)
  const [scimEnabled, setScimEnabled] = useState(false)
  const [showScimToken, setShowScimToken] = useState(false)
  const [showClientSecret, setShowClientSecret] = useState(false)

  const [samlMetadataUrl, setSamlMetadataUrl] = useState("")
  const [oidcClientId, setOidcClientId] = useState("")
  const [oidcClientSecret, setOidcClientSecret] = useState("")
  const [oidcDiscoveryUrl, setOidcDiscoveryUrl] = useState("")
  const [googleDomain, setGoogleDomain] = useState("")
  const [googleAdminEmail, setGoogleAdminEmail] = useState("")

  const [domainInput, setDomainInput] = useState("")
  const [verifiedDomains, setVerifiedDomains] = useState<VerifiedDomain[]>([])

  const scimToken = "scim_tok_a8f3k29d1m4x7b2c6e0g5h8j"
  const isEnterprise = false

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  function handleSaveProvider() {
    if (!isEnterprise) {
      toast.error("Enterprise plan required for SSO configuration")
      return
    }
    setSsoActive(true)
    toast.success(`${selectedProvider?.toUpperCase()} SSO configuration saved`)
  }

  function handleVerifyDomain() {
    if (!domainInput.trim()) return
    if (!isEnterprise) {
      toast.error("Enterprise plan required for domain verification")
      return
    }
    const txtRecord = `scraper-bot-verify=${btoa(domainInput).slice(0, 24)}`
    setVerifiedDomains((prev) => [
      ...prev,
      { domain: domainInput, status: "pending", txtRecord },
    ])
    setDomainInput("")
    toast.info(`Add the DNS TXT record to verify ${domainInput}`)
  }

  function handleRemoveDomain(domain: string) {
    setVerifiedDomains((prev) => prev.filter((d) => d.domain !== domain))
    toast.success(`Domain ${domain} removed`)
  }

  function handleToggleScim(enabled: boolean) {
    if (!isEnterprise) {
      toast.error("Enterprise plan required for SCIM provisioning")
      return
    }
    setScimEnabled(enabled)
    toast.success(enabled ? "SCIM provisioning enabled" : "SCIM provisioning disabled")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold">Single Sign-On (SSO)</h1>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
              Enterprise Plan Required
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Configure SAML 2.0 or OIDC-based single sign-on for your organization
          </p>
        </div>
      </div>

      {!isEnterprise && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">SSO requires an Enterprise plan</p>
              <p className="text-muted-foreground text-xs">
                Upgrade to configure SSO, SCIM provisioning, and domain verification
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Upgrade to Enterprise
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">SSO Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Status</p>
              <Badge
                variant={ssoActive ? "default" : "secondary"}
                className={ssoActive ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" : ""}
              >
                {ssoActive ? "Active" : "Not Configured"}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Provider</p>
              <p className="text-sm font-medium">
                {selectedProvider
                  ? selectedProvider === "saml"
                    ? "SAML 2.0"
                    : selectedProvider === "oidc"
                      ? "OpenID Connect"
                      : "Google Workspace"
                  : "None selected"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Domains</p>
              <p className="text-sm font-medium">
                {verifiedDomains.filter((d) => d.status === "verified").length > 0
                  ? verifiedDomains
                      .filter((d) => d.status === "verified")
                      .map((d) => d.domain)
                      .join(", ")
                  : "None"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-serif text-lg font-semibold mb-4">Identity Provider</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer transition-colors ${selectedProvider === "saml" ? "border-blue-600 ring-1 ring-blue-600" : "hover:border-muted-foreground/30"}`}
            onClick={() => setSelectedProvider("saml")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-serif">SAML 2.0</CardTitle>
              <CardDescription>Most common for enterprise IdPs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                Okta, Azure AD, OneLogin, PingIdentity
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${selectedProvider === "oidc" ? "border-blue-600 ring-1 ring-blue-600" : "hover:border-muted-foreground/30"}`}
            onClick={() => setSelectedProvider("oidc")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-serif">OpenID Connect</CardTitle>
              <CardDescription>OAuth 2.0 based authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                Auth0, Keycloak, custom OIDC providers
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${selectedProvider === "google" ? "border-blue-600 ring-1 ring-blue-600" : "hover:border-muted-foreground/30"}`}
            onClick={() => setSelectedProvider("google")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-serif">Google Workspace</CardTitle>
              <CardDescription>SSO via Google admin console</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                Auto-provision users from your Google org
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedProvider === "saml" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">SAML 2.0 Configuration</CardTitle>
            <CardDescription>
              Enter your IdP metadata URL or upload the certificate to configure SAML SSO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  ACS URL (Assertion Consumer Service)
                </Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="https://scraper.bot/auth/saml/callback"
                    className="font-mono text-xs bg-muted/50"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard("https://scraper.bot/auth/saml/callback", "ACS URL")}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Entity ID
                </Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="https://scraper.bot/saml/metadata"
                    className="font-mono text-xs bg-muted/50"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard("https://scraper.bot/saml/metadata", "Entity ID")}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>IdP Metadata URL</Label>
              <Input
                placeholder="https://your-idp.com/saml/metadata"
                value={samlMetadataUrl}
                onChange={(e) => setSamlMetadataUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Certificate</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-600/50 transition-colors cursor-pointer">
                <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drop your IdP certificate (.pem, .crt) here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  X.509 certificate from your identity provider
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveProvider}
              >
                Save SAML Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedProvider === "oidc" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">OpenID Connect Configuration</CardTitle>
            <CardDescription>
              Configure your OIDC provider credentials and discovery endpoint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Redirect URI
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value="https://scraper.bot/auth/oidc/callback"
                  className="font-mono text-xs bg-muted/50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard("https://scraper.bot/auth/oidc/callback", "Redirect URI")}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client ID</Label>
                <Input
                  placeholder="your-client-id"
                  value={oidcClientId}
                  onChange={(e) => setOidcClientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Client Secret</Label>
                <div className="flex gap-2">
                  <Input
                    type={showClientSecret ? "text" : "password"}
                    placeholder="your-client-secret"
                    value={oidcClientSecret}
                    onChange={(e) => setOidcClientSecret(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowClientSecret(!showClientSecret)}
                  >
                    {showClientSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Discovery URL</Label>
              <Input
                placeholder="https://your-idp.com/.well-known/openid-configuration"
                value={oidcDiscoveryUrl}
                onChange={(e) => setOidcDiscoveryUrl(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveProvider}
              >
                Save OIDC Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedProvider === "google" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Google Workspace Configuration</CardTitle>
            <CardDescription>
              Connect your Google Workspace organization for SSO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Workspace Domain</Label>
                <Input
                  placeholder="company.com"
                  value={googleDomain}
                  onChange={(e) => setGoogleDomain(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Admin Email</Label>
                <Input
                  placeholder="admin@company.com"
                  value={googleAdminEmail}
                  onChange={(e) => setGoogleAdminEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveProvider}
              >
                <Globe className="size-4 mr-2" />
                Connect Google Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Domain Verification</CardTitle>
          <CardDescription>
            All users with @domain.com emails will be auto-provisioned via SSO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="company.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerifyDomain()}
            />
            <Button onClick={handleVerifyDomain} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="size-4 mr-2" />
              Verify
            </Button>
          </div>

          {verifiedDomains.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>DNS TXT Record</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifiedDomains.map((d) => (
                  <TableRow key={d.domain}>
                    <TableCell className="font-medium">{d.domain}</TableCell>
                    <TableCell>
                      <Badge
                        variant={d.status === "verified" ? "default" : "secondary"}
                        className={
                          d.status === "verified"
                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                            : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                        }
                      >
                        {d.status === "verified" ? (
                          <>
                            <Check className="size-3" /> Verified
                          </>
                        ) : (
                          "Pending"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {d.txtRecord}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6"
                          onClick={() => copyToClipboard(d.txtRecord, "TXT record")}
                        >
                          <Copy className="size-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveDomain(d.domain)}
                      >
                        <X className="size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-lg">SCIM Provisioning</CardTitle>
              <CardDescription>
                Auto-provision and deprovision users from your identity provider
              </CardDescription>
            </div>
            <Switch
              checked={scimEnabled}
              onCheckedChange={handleToggleScim}
            />
          </div>
        </CardHeader>
        {scimEnabled && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                SCIM Endpoint URL
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value="https://scraper.bot/scim/v2"
                  className="font-mono text-xs bg-muted/50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard("https://scraper.bot/scim/v2", "SCIM endpoint")}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Bearer Token
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  type={showScimToken ? "text" : "password"}
                  value={scimToken}
                  className="font-mono text-xs bg-muted/50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowScimToken(!showScimToken)}
                >
                  {showScimToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(scimToken, "SCIM token")}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => toast.success("SCIM token regenerated")}
              >
                <RefreshCw className="size-4 mr-2" />
                Regenerate Token
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
