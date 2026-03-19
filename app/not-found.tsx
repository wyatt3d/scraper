import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="mb-8">
          <Logo size="lg" />
        </div>
        <p className="font-serif text-8xl font-bold text-muted-foreground/20 mb-4">
          404
        </p>
        <h1 className="font-serif text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="/docs" className="text-blue-600 hover:underline">
            View documentation
          </Link>
        </p>
      </div>
    </div>
  )
}
