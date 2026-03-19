import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CLI Reference",
}

function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <pre className="bg-muted/50 p-4 overflow-x-auto">
        <code className="text-sm">{children}</code>
      </pre>
    </div>
  )
}

const commands = [
  { command: "scraper flows list", description: "List all flows" },
  { command: "scraper flows create --url URL --mode extract", description: "Create a flow" },
  { command: "scraper flows run FLOW_ID", description: "Trigger a flow run" },
  { command: "scraper flows export FLOW_ID > flow.json", description: "Export flow as JSON" },
  { command: "scraper flows import flow.json", description: "Import flow from JSON" },
  { command: "scraper runs list --flow FLOW_ID", description: "List runs for a flow" },
  { command: "scraper runs logs RUN_ID", description: "Stream run logs in real-time" },
  { command: "scraper runs watch RUN_ID", description: "Watch a run with live progress" },
  { command: 'scraper extract --url URL --query "product names and prices"', description: "One-shot extraction" },
  { command: "scraper templates list", description: "Browse templates" },
  { command: "scraper templates use TEMPLATE_ID", description: "Create flow from template" },
  { command: "scraper config set KEY VALUE", description: "Set configuration" },
  { command: "scraper status", description: "Check platform status" },
]

const globalOptions = [
  { flag: "--format json|table|csv", description: "Output format (default: table)" },
  { flag: "--quiet", description: "Suppress non-essential output" },
  { flag: "--verbose", description: "Show debug information" },
  { flag: "--api-key KEY", description: "Override API key for this command" },
  { flag: "--profile NAME", description: "Use a named profile" },
]

export default function CliPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">CLI Reference</h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
        The Scraper.bot CLI lets you manage flows, trigger runs, and extract data directly from
        your terminal.
      </p>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Installation</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <CodeBlock label="npm / Homebrew">{`npm install -g @scraper-bot/cli
# or
brew install scraper-bot`}</CodeBlock>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Authentication</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <CodeBlock label="bash">{`scraper auth login
# Opens browser for OAuth login

scraper auth token scr_live_your_key_here
# Set API key directly`}</CodeBlock>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Commands Reference</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-semibold text-foreground">Command</th>
                  <th className="text-left py-3 font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {commands.map((cmd) => (
                  <tr key={cmd.command} className="border-b">
                    <td className="py-3 pr-4">
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{cmd.command}</code>
                    </td>
                    <td className="py-3">{cmd.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Example Workflows</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <CodeBlock label="Quick Extraction">{`scraper extract --url "https://news.ycombinator.com" \\
  --query "top 10 stories with title, points, and URL" \\
  --format json`}</CodeBlock>

          <CodeBlock label="Create and Schedule a Monitor">{`scraper flows create \\
  --name "Price Watch" \\
  --url "https://amazon.com/dp/B09V3KXJPB" \\
  --mode monitor \\
  --schedule "0 */6 * * *"`}</CodeBlock>

          <CodeBlock label="Watch a Run in Real-time">{`scraper runs watch run_abc123`}</CodeBlock>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Global Options</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-semibold text-foreground">Flag</th>
                  <th className="text-left py-3 font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {globalOptions.map((opt) => (
                  <tr key={opt.flag} className="border-b">
                    <td className="py-3 pr-4">
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{opt.flag}</code>
                    </td>
                    <td className="py-3">{opt.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold mb-4">Configuration</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Configuration is stored in{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm">~/.scraper-bot/config.json</code>.
            Use named profiles for multiple environments:
          </p>
          <CodeBlock label="bash">{`scraper config set api-key scr_live_... --profile production
scraper config set api-key scr_test_... --profile staging

# Use a profile
scraper flows list --profile staging`}</CodeBlock>
        </div>
      </section>
    </div>
  )
}
