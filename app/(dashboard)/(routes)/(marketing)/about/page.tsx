// app/(marketing)/about/page.tsx
// Public page — no auth required.

import { ArrowRight, MapPin, Calendar, Target, Eye } from "lucide-react";
import Link from "next/link";

const TEAM = [
  {
    initials: "FD",
    name: "[Founder Name]",
    title: "Founder & Executive Director",
    bio: "Leads Maxnovate's strategic direction, client relationships, and platform investments. Brings deep expertise in business advisory and East African markets.",
  },
  {
    initials: "CS",
    name: "[Secretary Name]",
    title: "Company Secretary",
    bio: "Responsible for corporate governance, statutory compliance, and maintaining Maxnovate's legal and regulatory standing.",
  },
];

const VALUES = [
  { title: "Integrity", body: "We operate with transparency and hold ourselves accountable to our clients, partners, and the communities we serve." },
  { title: "Innovation", body: "We challenge conventional approaches and build solutions that are fit for the African context — not imported templates." },
  { title: "Impact", body: "Every engagement is measured by tangible outcomes: growth, efficiency, revenue, and capability left behind." },
  { title: "Collaboration", body: "We work alongside our clients as partners, not vendors — sharing risk, knowledge, and commitment to results." },
];

export default function AboutPage() {
  return (
    <main className="flex-1">

      {/* ── Header ── */}
      <section className="px-6 pt-20 pb-12 max-w-5xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
          About us
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6 max-w-2xl">
          Built in Kampala. Built for Africa.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Maxnovate Consultancy Company Limited is a strategy, technology, and investment advisory firm
          helping organisations across East Africa grow, transform, and compete in a rapidly changing economy.
        </p>
      </section>

      {/* ── Story ── */}
      <section className="px-6 py-12 border-y border-border bg-muted/20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Mission</span>
            </div>
            <p className="text-base leading-relaxed">
              To accelerate the growth of African businesses and institutions by providing
              world-class consulting, building scalable digital platforms, and investing in
              the entrepreneurs and ideas that will define the continent's next chapter.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-primary" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Vision</span>
            </div>
            <p className="text-base leading-relaxed">
              A thriving, self-sufficient African private sector — where local expertise,
              technology, and capital combine to solve local problems at scale.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-8">
          What we stand for
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {VALUES.map(({ title, body }) => (
            <div key={title} className="p-5 rounded-lg border border-border hover:border-primary/30 transition-colors">
              <h3 className="font-semibold text-sm mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="px-6 py-12 border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-8">
            Leadership
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {TEAM.map(({ initials, name, title, bio }) => (
              <div key={name} className="flex gap-4 p-5 bg-background rounded-lg border border-border">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick facts ── */}
      <section className="px-6 py-12 border-t border-border max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-8 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            P.O. Box 208803 Kampala GPO, Uganda
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Incorporated 2025
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-10 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">Want to know more about how we work?</p>
          <div className="flex gap-3">
            <Link href="/services"
              className="inline-flex items-center gap-1.5 text-sm border border-border px-4 py-2 rounded-md hover:bg-accent transition-colors">
              Our services
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Get in touch <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
