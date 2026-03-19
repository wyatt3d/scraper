export function TrustedBy() {
  return (
    <section className="py-16 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground tracking-wide uppercase mb-8">
          Trusted by teams at startups and enterprises worldwide
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-4 max-w-3xl mx-auto text-center">
          <div>
            <p className="font-serif font-black text-3xl md:text-4xl text-foreground">
              Built for Scale
            </p>
            <p className="text-sm text-muted-foreground mt-1">High-volume extraction</p>
          </div>
          <div>
            <p className="font-serif font-black text-3xl md:text-4xl text-foreground">
              Enterprise-Ready
            </p>
            <p className="text-sm text-muted-foreground mt-1">SOC 2 compliant</p>
          </div>
          <div>
            <p className="font-serif font-black text-3xl md:text-4xl text-foreground">
              99%+
            </p>
            <p className="text-sm text-muted-foreground mt-1">Uptime Target</p>
          </div>
          <div>
            <p className="font-serif font-black text-3xl md:text-4xl text-foreground">
              24/7
            </p>
            <p className="text-sm text-muted-foreground mt-1">Monitoring</p>
          </div>
        </div>
      </div>
    </section>
  )
}
