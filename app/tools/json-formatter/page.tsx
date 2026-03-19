"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Minimize2,
  CheckCircle,
  AlertCircle,
  Copy,
} from "lucide-react"

const PLACEHOLDER_JSON = `{"users":[{"id":1,"name":"Alice","email":"alice@example.com","roles":["admin","editor"]},{"id":2,"name":"Bob","email":"bob@example.com","roles":["viewer"]}],"meta":{"total":2,"page":1}}`

export default function JsonFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [status, setStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleFormat = useCallback(() => {
    setStatus(null)
    setCopied(false)
    if (!input.trim()) {
      setStatus({ type: "error", message: "Paste some JSON first." })
      setOutput("")
      return
    }
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setStatus({ type: "success", message: "Formatted successfully." })
    } catch (e) {
      const msg = e instanceof SyntaxError ? e.message : "Invalid JSON"
      setOutput("")
      setStatus({ type: "error", message: msg })
    }
  }, [input])

  const handleMinify = useCallback(() => {
    setStatus(null)
    setCopied(false)
    if (!input.trim()) {
      setStatus({ type: "error", message: "Paste some JSON first." })
      setOutput("")
      return
    }
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setStatus({ type: "success", message: "Minified successfully." })
    } catch (e) {
      const msg = e instanceof SyntaxError ? e.message : "Invalid JSON"
      setOutput("")
      setStatus({ type: "error", message: msg })
    }
  }, [input])

  const handleValidate = useCallback(() => {
    setCopied(false)
    if (!input.trim()) {
      setStatus({ type: "error", message: "Paste some JSON first." })
      return
    }
    try {
      JSON.parse(input)
      setStatus({ type: "success", message: "Valid JSON" })
    } catch (e) {
      const msg = e instanceof SyntaxError ? e.message : "Invalid JSON"
      setStatus({ type: "error", message: `Invalid: ${msg}` })
    }
  }, [input])

  const handleCopy = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement("textarea")
      textarea.value = output
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [output])

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
              JSON Formatter & Validator
            </h1>
            <Badge variant="secondary" className="text-xs">
              Free Tool by Scraper.bot
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Paste raw JSON to format, validate, or minify instantly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Raw JSON Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder={PLACEHOLDER_JSON}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 py-4 lg:py-0">
            <Button onClick={handleFormat} size="sm" className="w-32">
              <Braces className="w-4 h-4 mr-2" />
              Format
            </Button>
            <Button
              onClick={handleMinify}
              size="sm"
              variant="outline"
              className="w-32"
            >
              <Minimize2 className="w-4 h-4 mr-2" />
              Minify
            </Button>
            <Button
              onClick={handleValidate}
              size="sm"
              variant="outline"
              className="w-32"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Validate
            </Button>
            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
              className="w-32"
              disabled={!output}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          <div className="flex-1 min-w-0">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Output</CardTitle>
                  {status && (
                    <Badge
                      variant={
                        status.type === "success" ? "default" : "destructive"
                      }
                      className={
                        status.type === "success"
                          ? "bg-green-600 hover:bg-green-600"
                          : ""
                      }
                    >
                      {status.type === "success" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {status.message}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {output ? (
                  <pre className="bg-zinc-950 text-zinc-100 rounded-md p-4 font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-[400px] overflow-y-auto">
                    {output}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-[358px] text-sm text-muted-foreground border border-dashed border-border rounded-md">
                    Formatted output will appear here.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Need to extract JSON from websites? Try{" "}
            <span className="font-serif font-semibold">
              Scraper<span className="text-blue-600">.bot</span>
            </span>
          </p>
          <Link href="/pricing">
            <Button variant="default">
              Start scraping for free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
