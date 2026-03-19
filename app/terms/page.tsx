import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/brand/logo"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Scraper.bot web scraping and automation platform.",
}

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: March 19, 2026
          </p>
        </header>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Scraper.bot (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              2. Description of Service
            </h2>
            <p>
              Scraper.bot is a web scraping automation platform that provides AI-powered data extraction, browser automation, structured API generation, and related services. The Service includes access to our web application, REST API, SDKs, and documentation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              3. Account Registration
            </h2>
            <p>
              To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to keep your account information up to date. You are responsible for safeguarding your password and for all activities that occur under your account. Each individual may maintain only one account.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              4. Acceptable Use
            </h2>
            <p className="mb-3">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Scrape or collect private or personal data without the explicit consent of the data subjects</li>
              <li>Violate the terms of service of any target website</li>
              <li>Engage in any illegal activity or facilitate the violation of any law or regulation</li>
              <li>Reverse engineer, decompile, or disassemble any aspect of the Service</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Attempt to gain unauthorized access to the Service or its related systems</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              5. API Usage &amp; Rate Limits
            </h2>
            <p>
              API access is subject to the rate limits and usage quotas associated with your subscription plan. We reserve the right to throttle or suspend API access if we detect abuse, excessive usage beyond your plan limits, or behavior that degrades the Service for other users. Current rate limits are documented in our API reference.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              6. Data &amp; Privacy
            </h2>
            <p>
              You retain ownership of all data you extract using the Service. We do not sell, share, or monetize your extracted data. Our handling of your personal information is governed by our{" "}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              7. Intellectual Property
            </h2>
            <p>
              The Service, including its original content, features, and functionality, is owned by Scraper and is protected by international copyright, trademark, and other intellectual property laws. You retain all rights to the flows you create and the data you extract through the Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              8. Payment Terms
            </h2>
            <p>
              Paid plans are billed on a monthly or annual subscription basis. Subscriptions automatically renew at the end of each billing period unless cancelled before the renewal date. You may cancel your subscription at any time through your account settings. We offer a 30-day refund policy for new subscriptions. Refund requests should be directed to our support team.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Scraper and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service. Our total liability for any claims arising under these Terms shall not exceed the amount you paid us in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              10. Termination
            </h2>
            <p>
              Either party may terminate this agreement at any time. You may terminate by closing your account through the settings page. We may terminate or suspend your access immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the Service will cease immediately. You will have 30 days after termination to export your data, after which it may be permanently deleted.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              11. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If we make material changes, we will notify you via email at the address associated with your account at least 30 days before the changes take effect. Your continued use of the Service after the effective date constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              12. Contact
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@scraper.bot" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
                legal@scraper.bot
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
