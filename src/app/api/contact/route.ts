import { NextResponse } from "next/server";
export const runtime = "nodejs";

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY; // server secret
const GMAIL_USER = process.env.GMAIL_USER;                 // your gmail e.g. overly@gmail.com
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // Gmail App Password
const LEADS_TO = process.env.LEADS_TO || GMAIL_USER;       // where to receive leads
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;   // optional

async function verifyTurnstile(token: string) {
  if (!TURNSTILE_SECRET) return false;
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token }),
  });
  const data = await r.json();
  return !!data?.success;
}

async function sendEmail(payload: {
  name: string; email: string; company?: string; projectScale?: string; message: string;
}) {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !LEADS_TO) return;

  const fromName = process.env.BRAND_FROM_NAME || "Overly Leads";
  const recipients = (LEADS_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  const html = `
    <h2>New Overly Contact</h2>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Company:</strong> ${payload.company || "—"}</p>
    <p><strong>Project scale:</strong> ${payload.projectScale || "—"}</p>
    <p><strong>Message:</strong><br/>${payload.message.replace(/\n/g, "<br/>")}</p>
  `;

  await transporter.sendMail({
    from: `"${fromName}" <${GMAIL_USER}>`,
    to: recipients,
    replyTo: `${payload.name} <${payload.email}>`,
    subject: `New lead from ${payload.name}`,
    html,
    text: `New Overly Contact

Name: ${payload.name}
Email: ${payload.email}
Company: ${payload.company || "—"}
Project scale: ${payload.projectScale || "—"}

Message:
${payload.message}`,
  });
}

async function sendSlack(payload: { name: string; email: string; company?: string; projectScale?: string; message: string }) {
  if (!SLACK_WEBHOOK_URL) return;
  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text: `🆕 Lead: ${payload.name} (${payload.email})`,
      attachments: [
        {
          color: "#4f46e5",
          fields: [
            { title: "Company", value: payload.company || "—", short: true },
            { title: "Project scale", value: payload.projectScale || "—", short: true },
            { title: "Message", value: payload.message || "—", short: false },
          ],
          footer: "Overly Contact",
        },
      ],
    }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body?.name;
    const email = body?.email;
    const company = body?.company;
    const message = body?.message;
    const cfToken = body?.cfToken;

    // Accept new + legacy key gracefully
    const projectScale = body?.projectScale ?? body?.budget ?? "";

    if (!name || !email || !message || !cfToken) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const captchaOK = await verifyTurnstile(cfToken);
    if (!captchaOK) {
      return NextResponse.json({ ok: false, error: "Captcha failed" }, { status: 400 });
    }

    await Promise.all([
      sendEmail({ name, email, company, projectScale, message }),
      sendSlack({ name, email, company, projectScale, message }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("/api/contact error", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}