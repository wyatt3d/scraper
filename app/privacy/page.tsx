import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/brand/logo"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Scraper.bot web scraping and automation platform.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Logo href="/" />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Scraper.bot
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: March 19, 2026
          </p>
        </header>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Account information:</strong> name, email address, and password when you create an account</li>
              <li><strong className="text-foreground">Usage data:</strong> information about how you use the Service, including flows created, API calls made, and features accessed</li>
              <li><strong className="text-foreground">Cookies:</strong> essential cookies required for authentication and session management</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              2. How We Use Information
            </h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities to improve the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              3. Data Storage &amp; Security
            </h2>
            <p>
              All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. We follow SOC 2 security practices, including regular security audits, access controls, and incident response procedures. Our infrastructure is hosted on secure, enterprise-grade cloud providers with redundant backups.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              4. Cookies
            </h2>
            <p>
              We use only essential cookies required for the Service to function properly, such as authentication tokens and session identifiers. We use Vercel Analytics for anonymous, privacy-friendly usage analytics. We do not use third-party advertising cookies or tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              5. Third-Party Services
            </h2>
            <p className="mb-3">We use the following third-party services to operate the platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Vercel:</strong> hosting and deployment infrastructure</li>
              <li><strong className="text-foreground">Stripe:</strong> payment processing (we never store your full credit card details)</li>
              <li><strong className="text-foreground">Email provider:</strong> transactional email delivery for account notifications and alerts</li>
            </ul>
            <p className="mt-3">
              Each third-party provider is bound by their own privacy policies and data processing agreements.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              6. Data Retention
            </h2>
            <p>
              We retain your account data for as long as your account is active. Extracted data is retained according to your plan&apos;s retention period (7 days for Free, 30 days for Pro, custom for Enterprise). After account closure, all personal data and account information is permanently deleted within 90 days.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              7. Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and receive a copy of the personal data we hold about you</li>
              <li>Export your flows, run history, and extracted data at any time</li>
              <li>Request deletion of your personal data and account</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Request correction of inaccurate personal data</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@scraper.bot" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
                privacy@scraper.bot
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              8. Children&apos;s Privacy
            </h2>
            <p>
              The Service is not intended for use by anyone under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal data from a child under 13, we will take steps to delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              9. International Data
            </h2>
            <p>
              Your information is processed and stored in the United States. By using the Service, you consent to the transfer of your information to the United States, which may have different data protection laws than your country of residence. We take appropriate safeguards to ensure your data is protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              10. Changes to Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you via email at the address associated with your account. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              11. Contact
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@scraper.bot" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
                privacy@scraper.bot
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
