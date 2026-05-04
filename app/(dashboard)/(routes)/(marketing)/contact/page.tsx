// app/(marketing)/contact/page.tsx
// Wired version — uses the submitContact server action + useFormState.
// Replaces the previous simulated-delay version.

"use client";

import { useActionState, useRef, useEffect } from "react";
// import { submitContact, type ContactFormState } from "@/actions/contact";
import { ArrowRight, Mail, Phone, Building2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ContactFormState, submitContact } from "../../actions/contact";

const PLATFORMS = [
  { label: "InstaSkul", href: "https://instaskul.com",        tag: "EdTech"    },
  { label: "Studio AI", href: "https://studio.maxnovate.com", tag: "AI"        },
  { label: "Vendly",    href: "https://vendly.com",           tag: "Commerce"  },
];

const ENQUIRY_TYPES = [
  "Management consulting",
  "Financial & investment advisory",
  "Digital transformation",
  "Training & capacity building",
  "Platform products (InstaSkul / Studio / Vendly)",
  "Partnership or investment",
  "Media & press",
  "Other",
];

const initialState: ContactFormState = { status: "idle" };

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Scroll to top of form on error so user sees the message
  useEffect(() => {
    if (state.status === "error") {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state]);

  return (
    <main className="flex-1">

      {/* ── Header ── */}
      <section className="px-6 pt-20 pb-12 max-w-5xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Get in touch
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 max-w-xl">
          Let&apos;s start a conversation.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          Whether you have a specific brief or just want to explore what&apos;s possible,
          we&apos;re happy to talk.
        </p>
      </section>

      {/* ── Main grid ── */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10">

          {/* ── Form ── */}
          <div className="md:col-span-3">

            {state.status === "success" ? (
              <div className="flex flex-col items-start gap-4 py-10">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-base mb-1">Message received.</p>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                    Thank you for reaching out. A member of the Maxnovate team will be in touch
                    within two business days. A confirmation has been sent to your email.
                  </p>
                </div>
              </div>

            ) : (
              <form ref={formRef} action={formAction} className="space-y-5">

                {/* Error banner */}
                {state.status === "error" && (
                  <div className="flex items-start gap-2.5 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {state.message}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="name">
                      Full name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="name" name="name" type="text" required
                      placeholder="Jane Nakato"
                      disabled={isPending}
                      className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="organisation">
                      Organisation
                    </label>
                    <input
                      id="organisation" name="organisation" type="text"
                      placeholder="Your company or institution"
                      disabled={isPending}
                      className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="email">
                    Email address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email" name="email" type="email" required
                    placeholder="jane@example.com"
                    disabled={isPending}
                    className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="phone">
                    Phone number
                  </label>
                  <input
                    id="phone" name="phone" type="tel"
                    placeholder="+256 7XX XXX XXX"
                    disabled={isPending}
                    className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="enquiry">
                    Nature of enquiry <span className="text-primary">*</span>
                  </label>
                  <select
                    id="enquiry" name="enquiry" required defaultValue=""
                    disabled={isPending}
                    className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60 transition"
                  >
                    <option value="" disabled>Select a topic…</option>
                    {ENQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="message">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message" name="message" required rows={5}
                    disabled={isPending}
                    placeholder="Tell us briefly what you're working on or what you need help with…"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-60 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? (
                    <>
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

          {/* ── Contact details sidebar ── */}
          <div className="md:col-span-2 space-y-8">

            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Find us
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">
                    Maxnovate Consultancy Company Limited<br />
                    P.O. Box 208803 Kampala GPO<br />
                    Kampala, Uganda
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href="mailto:support@instaskul.com"
                    className="text-muted-foreground hover:text-primary transition-colors">
                    info@maxnovate.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href="tel:+256000000000"
                    className="text-muted-foreground hover:text-primary transition-colors">
                    +256 [number]
                  </a>
                </li>
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Response time
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We aim to respond to all enquiries within{" "}
                <span className="text-foreground font-medium">2 business days</span>.
                For urgent matters, please include a phone number.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Platform enquiries
              </p>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                For product-specific questions, visit the platform directly:
              </p>
              <ul className="space-y-2">
                {PLATFORMS.map(({ label, href, tag }) => (
                  <li key={label}>
                    <Link href={href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
                      <span>{label}</span>
                      <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/50 group-hover:text-primary/50 transition-colors">
                        {tag}
                      </span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
