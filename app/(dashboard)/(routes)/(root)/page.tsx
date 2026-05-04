// This is a PUBLIC page (no auth redirect).
// The news/blog feed lives at /news; editor dashboard at /editor.
// Auth is only enforced on /editor/* routes via middleware or layout.

import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, ShoppingBag, Sparkles, Briefcase, BarChart2, Globe } from "lucide-react";

// ─── Platform suite ────────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    label: "InstaSkul",
    tagline: "EdTech platform",
    description: "Courses, certifications, and learning management for professionals and institutions.",
    href: "https://instaskul.com",
    icon: GraduationCap,
    available: true,
  },
  {
    label: "Studio AI",
    tagline: "AI workspace",
    description: "AI-powered tools for content creation, research, and business automation.",
    href: "https://studio.maxnovate.com",
    icon: Sparkles,
    available: true,
  },
  {
    label: "Vendly",
    tagline: "E-commerce",
    description: "Smart commerce infrastructure for entrepreneurs.",
    href: "https://vendly.com",
    icon: ShoppingBag,
    available: true,
  },
  {
    label: "The Editorial",
    tagline: "News & Insights",
    description: "Business news, analysis, and thought leadership from your favorite freelance creators.",
    href: "/news",
    icon: BookOpen,
    available: true,
  },
] as const;

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: Briefcase,
    title: "Management Consulting",
    description: "Strategy development, organisational capacity-building, and business advisory for entrepreneurs and institutions.",
  },
  {
    icon: BarChart2,
    title: "Financial & Investment Advisory",
    description: "Financial consulting, project management, and investment structuring tailored to the needs of modern businesses.",
  },
  {
    icon: Globe,
    title: "Digital Transformation",
    description: "Technology consulting, IT strategy, and end-to-end digital transformation programmes for organisations of all sizes.",
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-5xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Kampala, Uganda · Est. 2025
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-3xl">
          Consulting that{" "}
          <span className="text-primary">builds</span>{" "}
          the next generation business.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
          Maxnovate Consultancy is a strategy, technology, and investment advisory firm headquartered in Kampala.
          We power growth, transformation, and global leverage — and we build platforms to accelerate that mission.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Work with us <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-md text-sm font-medium hover:bg-accent transition-colors"
          >
            About Maxnovate
          </Link>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="px-6 py-16 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-8">
            What we do
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group p-6 bg-background rounded-lg border border-border hover:border-primary/40 transition-colors">
                <Icon className="h-5 w-5 text-primary mb-4" />
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
            >
              View all services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Platform Suite ── */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
          The Maxnovate platform
        </p>
        <h2 className="text-2xl font-bold mb-2">Beyond consulting.</h2>
        <p className="text-muted-foreground mb-8 max-w-xl text-sm leading-relaxed">
          We build and invest in digital platforms across education, commerce, AI, and media — connected under the Maxnovate network.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {PLATFORMS.map(({ label, tagline, description, href, icon: Icon, available }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`group block p-5 rounded-lg border transition-all ${
                available
                  ? "border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer"
                  : "border-dashed border-border/50 opacity-50 cursor-not-allowed pointer-events-none"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{label}</span>
                    <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
                      {tagline}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </div>
                {available && (
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5 flex-shrink-0" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section className="px-6 py-12 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Ready to start a conversation?</h2>
            <p className="text-sm text-muted-foreground">
              P.O. Box 208803 Kampala GPO · Uganda
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
