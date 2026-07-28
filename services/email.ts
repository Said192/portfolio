/**
 * Contact email delivery via Resend.
 *
 * If RESEND_API_KEY is missing the caller should fall back to demo mode —
 * this module never throws at import time and is only invoked when a key
 * exists, so a missing key can never break the build.
 *
 * EmailJS fallback: if you prefer EmailJS, send directly from the client in
 * components/sections/Contact.tsx using @emailjs/browser and your public key
 * (see README "Email providers"). Resend is the recommended default because
 * it keeps credentials on the server.
 */
import { Resend } from "resend";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(payload: ContactPayload, apiKey: string): Promise<void> {
  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL || "swalikhan885@gmail.com";

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to,
    replyTo: payload.email,
    subject: `[Portfolio] ${payload.subject}`,
    text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
  });

  if (error) {
    throw new Error(error.message);
  }
}
