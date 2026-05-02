// app/actions/contact.ts
// Server action — handles contact form submission via Resend.
//
// Setup (one-time):
//   1.  npm install resend
//   2.  Create a free account at https://resend.com
//   3.  Add your domain (maxnovate.com) and verify DNS records
//   4.  Copy your API key → .env.local: RESEND_API_KEY=re_xxxxxxxxxxxx
//   5.  Set CONTACT_TO_EMAIL=info@maxnovate.com in .env.local
//
// The action returns a typed result so the client can show success/error
// without a page reload.

"use server";

import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Validation schema ────────────────────────────────────────────────────────

const ContactSchema = z.object({
  name:         z.string().min(2,  "Please enter your full name."),
  organisation: z.string().optional(),
  email:        z.string().email("Please enter a valid email address."),
  phone:        z.string().optional(),
  enquiry:      z.string().min(1,  "Please select an enquiry type."),
  message:      z.string().min(10, "Please write a message of at least 10 characters."),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

// ─── Action ───────────────────────────────────────────────────────────────────

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {

  // 1. Parse & validate
  const raw = {
    name:         formData.get("name"),
    organisation: formData.get("organisation"),
    email:        formData.get("email"),
    phone:        formData.get("phone"),
    enquiry:      formData.get("enquiry"),
    message:      formData.get("message"),
  };

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    const first = parsed.error.errors[0]?.message ?? "Please check your submission.";
    return { status: "error", message: first };
  }

  const { name, organisation, email, phone, enquiry, message } = parsed.data;

  // 2. Send notification email to Maxnovate
  try {
    await resend.emails.send({
      from:    "Maxnovate Website <noreply@maxnovate.com>",
      to:      [process.env.CONTACT_TO_EMAIL ?? "info@maxnovate.com"],
      replyTo: email,
      subject: `New enquiry: ${enquiry} — ${name}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A3A5C;">
          <div style="border-bottom:2px solid #C89B2A;padding-bottom:12px;margin-bottom:24px;">
            <h1 style="font-size:20px;margin:0;">New contact form submission</h1>
            <p style="font-size:12px;color:#888;margin:4px 0 0;">Maxnovate Consultancy website</p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;color:#555;width:140px;">Name</td><td style="padding:8px 0;font-weight:bold;">${name}</td></tr>
            ${organisation ? `<tr><td style="padding:8px 0;color:#555;">Organisation</td><td style="padding:8px 0;">${organisation}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#555;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#1A3A5C;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#555;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#555;">Enquiry type</td><td style="padding:8px 0;">${enquiry}</td></tr>
          </table>

          <div style="margin-top:24px;padding:16px;background:#f7f4ee;border-left:3px solid #C89B2A;">
            <p style="font-size:13px;color:#555;margin:0 0 8px;">Message</p>
            <p style="font-size:14px;margin:0;white-space:pre-wrap;">${message}</p>
          </div>

          <p style="font-size:11px;color:#aaa;margin-top:32px;">
            Sent from maxnovate.com/contact · Reply-To is set to the sender's email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[contact action] Resend error:", err);
    return {
      status: "error",
      message: "Sorry, we could not send your message right now. Please email us directly at info@maxnovate.com.",
    };
  }

  // 3. Send confirmation email to the sender
  try {
    await resend.emails.send({
      from:    "Maxnovate Consultancy <noreply@maxnovate.com>",
      to:      [email],
      subject: "We received your message — Maxnovate",
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A3A5C;">
          <div style="border-bottom:2px solid #C89B2A;padding-bottom:12px;margin-bottom:24px;">
            <h1 style="font-size:18px;margin:0;">Thank you, ${name}.</h1>
          </div>
          <p style="font-size:14px;line-height:1.7;">
            We have received your message regarding <strong>${enquiry}</strong>
            and will be in touch within two business days.
          </p>
          <p style="font-size:14px;line-height:1.7;">
            If you have anything to add in the meantime, simply reply to this email.
          </p>
          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e5e5;font-size:12px;color:#888;">
            Maxnovate Consultancy Company Limited<br/>
            P.O. Box 208803 Kampala GPO, Uganda<br/>
            <a href="https://maxnovate.com" style="color:#C89B2A;">maxnovate.com</a>
          </div>
        </div>
      `,
    });
  } catch {
    // Confirmation email failure is non-fatal — the main notification already sent
    console.warn("[contact action] Confirmation email failed — non-fatal");
  }

  return { status: "success" };
}
