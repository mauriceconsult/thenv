// app/(marketing)/services/page.tsx
// Public page — no auth required.

import { ArrowRight, Briefcase, BarChart2, Globe, GraduationCap, Sparkles, ShoppingBag, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// ─── Consulting services (from Memorandum of Association objects) ──────────────
const CONSULTING = [
  {
    icon: Briefcase,
    title: "Management Consulting",
    description:
      "We work with founders, executives, and institutions to sharpen strategy, restructure operations, and build the organisational capacity to execute.",
    deliverables: [
      "Strategic planning & business modelling",
      "Organisational design & restructuring",
      "Change management & transformation programmes",
      "Board advisory & governance frameworks",
    ],
  },
  {
    icon: BarChart2,
    title: "Financial & Investment Advisory",
    description:
      "From financial modelling to investment structuring, we help businesses raise capital, allocate resources, and manage risk in the East African context.",
    deliverables: [
      "Financial analysis & modelling",
      "Investment readiness & pitch preparation",
      "Project finance & feasibility studies",
      "Budget planning & cost optimisation",
    ],
  },
  {
    icon: Globe,
    title: "Digital Transformation",
    description:
      "We help organisations move from analogue processes to digital-first operations — with technology choices that fit their scale and budget.",
    deliverables: [
      "IT strategy & technology roadmaps",
      "Digital process design & automation",
      "Software procurement & vendor management",
      "Cybersecurity & data governance advisory",
    ],
  },
  {
    icon: GraduationCap,
    title: "Research, Training & Capacity Building",
    description:
      "We design and deliver bespoke training programmes, workshops, and research engagements that leave lasting capability inside your team.",
    deliverables: [
      "Leadership & management development",
      "Sector-specific research & white papers",
      "Workshop design & facilitation",
      "Monitoring, evaluation & learning (MEL) frameworks",
    ],
  },
];

// ─── Platform products ─────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    icon: GraduationCap,
    label: "InstaSkul",
    category: "EdTech",
    blurb: "Learning management, online courses, and professional certifications for East African institutions and individuals.",
    href: "https://instaskul.com",
  },
  {
    icon: Sparkles,
    label: "Studio AI",
    category: "AI Workspace",
    blurb: "AI-powered tools for content creation, research automation, and business intelligence.",
    href: "https://studio.maxnovate.com",
  },
  {
    icon: ShoppingBag,
    label: "Vendly",
    category: "E-commerce",
    blurb: "Commerce infrastructure built for African sellers — inventory, payments, and storefronts in one place.",
    href: "https://vendly.com",
  },
];

// ─── Engagement model ──────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", title: "Discovery call", body: "A free 30-minute conversation to understand your challenge and whether we are the right fit." },
  { n: "02", title: "Scoping & proposal", body: "We define objectives, deliverables, timelines, and fees — clearly, in writing, before any work begins." },
  { n: "03", title: "Engagement", body: "Collaborative work with your team: workshops, analysis, builds, or advisory — whatever the scope requires." },
  { n: "04", title: "Handover & follow-on", body: "We document outcomes, train your team, and remain available for follow-on support as you implement." },
];

export default function ServicesPage() {
  return (
    <main className="flex-1">

      {/* ── Header ── */}
      <section className="px-6 pt-20 pb-12 max-w-5xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
          What we offer
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6 max-w-2xl">
          Services designed for African growth.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          We offer consulting engagements and platform products across strategy, technology, finance,
          and education. All grounded in a deep understanding of the East African business environment.
        </p>
      </section>

      {/* ── Consulting services ── */}
      <section className="px-6 py-12 border-t border-border max-w-5xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-8">
          Consulting
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {CONSULTING.map(({ icon: Icon, title, description, deliverables }) => (
            <div key={title} className="p-6 rounded-lg border border-border hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h2 className="font-semibold text-sm">{title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
              <ul className="space-y-1.5">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform products ── */}
      <section className="px-6 py-12 border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Platform products
          </p>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl">
            Beyond consulting, we build and operate digital platforms that extend our mission into scalable products.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLATFORMS.map(({ icon: Icon, label, category, blurb, href }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-5 bg-background rounded-lg border border-border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-semibold text-sm">{label}</span>
                </div>
                <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-2">{category}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{blurb}</p>
                <p className="mt-3 text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit <ArrowRight className="h-3 w-3" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we engage ── */}
      <section className="px-6 py-16 border-t border-border max-w-5xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-8">
          How we work
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map(({ n, title, body }) => (
            <div key={n} className="p-5 rounded-lg border border-border">
              <p className="font-mono text-2xl font-bold text-primary/20 mb-3 leading-none">{n}</p>
              <h3 className="font-semibold text-sm mb-2">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-10 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-sm mb-1">Ready to work together?</p>
            <p className="text-sm text-muted-foreground">Let's start with a free discovery call.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </main>
  );
}
