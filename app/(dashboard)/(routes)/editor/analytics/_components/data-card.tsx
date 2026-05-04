// app/(dashboard)/(routes)/editor/analytics/_components/data-card.tsx
"use client";

import { cn } from "@/lib/utils";

interface DataCardProps {
  label:       string;
  value:       number;
  sub?:        string;      // e.g. "of 12 total"
  accent?:     boolean;     // gold highlight
  format?:     "number" | "percent";
}

export function DataCard({ label, value, sub, accent = false, format = "number" }: DataCardProps) {
  const display = format === "percent" ? `${value}%` : value.toLocaleString();

  return (
    <div className={cn(
      "relative border border-border bg-background p-5 overflow-hidden",
      accent && "border-[#C89B2A]/60"
    )}>
      {/* Gold top rule on accent cards */}
      {accent && (
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-[#C89B2A]" />
      )}

      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
        {label}
      </p>
      <p className={cn(
        "font-serif text-4xl font-bold leading-none tracking-tight",
        accent ? "text-[#C89B2A]" : "text-foreground"
      )}>
        {display}
      </p>
      {sub && (
        <p className="font-mono text-[9px] text-muted-foreground/60 mt-2 tracking-wide">
          {sub}
        </p>
      )}
    </div>
  );
}
