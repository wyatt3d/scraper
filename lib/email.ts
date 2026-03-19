import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Scraper.bot <noreply@scraper.bot>",
      to,
      subject,
      html,
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error("[Email]", error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to Scraper.bot!",
    html: `
      <h1>Welcome to Scraper.bot, ${name}!</h1>
      <p>Your account is ready. Here's how to get started:</p>
      <ol>
        <li><a href="https://scraper.bot/docs/quickstart">Read the Quickstart Guide</a></li>
        <li><a href="https://scraper.bot/flows/new">Create your first flow</a></li>
        <li><a href="https://scraper.bot/templates">Browse templates</a></li>
      </ol>
      <p>Need help? <a href="https://scraper.bot/docs">Check our docs</a> or reply to this email.</p>
      <p>— The Scraper.bot Team</p>
    `,
  })
}

export async function sendAlertEmail(email: string, alertMessage: string, flowName: string) {
  return sendEmail({
    to: email,
    subject: `[Scraper.bot Alert] ${flowName}`,
    html: `
      <h2>Alert: ${flowName}</h2>
      <p>${alertMessage}</p>
      <p><a href="https://scraper.bot/monitoring">View in Dashboard</a></p>
    `,
  })
}
