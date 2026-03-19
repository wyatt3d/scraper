import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const { plan } = await request.json()

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Scraper.bot ${plan} Plan`,
              description: plan === "pro"
                ? "5,000 runs/mo, unlimited flows, all integrations"
                : "Custom enterprise plan",
            },
            unit_amount: plan === "pro" ? 2900 : 9900,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get("origin")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
