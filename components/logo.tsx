// components/logo.tsx
// Usage:
//   <Logo />                        — full horizontal lockup, light
//   <Logo variant="dark" />         — full horizontal lockup, dark bg
//   <Logo variant="mark" />         — icon mark only
//   <Logo variant="compact" />      — stacked mark + name, small spaces
//   <Logo size="sm" | "md" | "lg" />

import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogoVariant = "light" | "dark" | "mark" | "compact";
type LogoSize    = "sm" | "md" | "lg";

interface LogoProps {
  variant?: LogoVariant;
  size?:    LogoSize;
  href?:    string;        // defaults to "/"
  className?: string;
  asLink?:  boolean;       // wrap in <Link> (default true)
}

// ─── Size scale ───────────────────────────────────────────────────────────────

const SIZES: Record<LogoSize, {
  mark: { w: number; h: number };
  name: string;
  tag:  string;
  gap:  number;
}> = {
  sm: { mark: { w: 30, h: 26 }, name: "text-[13px]",  tag: "text-[7px]",  gap: 8  },
  md: { mark: { w: 46, h: 40 }, name: "text-[18px]",  tag: "text-[9px]",  gap: 12 },
  lg: { mark: { w: 60, h: 52 }, name: "text-[24px]",  tag: "text-[11px]", gap: 16 },
};

// ─── Mark SVG ─────────────────────────────────────────────────────────────────

function Mark({
  w,
  h,
  color1 = "#1A3A5C",
  color2 = "#C89B2A",
}: {
  w: number;
  h: number;
  color1?: string;
  color2?: string;
}) {
  // Three rising parallelogram bars scaled to w × h
  // Original geometry at 60 × 52; we scale via SVG viewBox
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 60 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon points="0,52 14,0 28,0 14,52"  fill={color1} />
      <polygon points="18,52 32,0 46,0 32,52" fill={color2} />
      <polygon points="34,52 46,16 60,16 48,52" fill={color1} opacity="0.35" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Logo({
  variant  = "light",
  size     = "md",
  href     = "/",
  className,
  asLink   = true,
}: LogoProps) {
  const s      = SIZES[size];
  const isDark = variant === "dark";
  const isMark = variant === "mark";
  const isCompact = variant === "compact";

  const color1 = isDark ? "#E8F0F8" : "#1A3A5C";
  const color2 = "#C89B2A";
  const nameColor = isDark
    ? "text-[#E8F0F8]"
    : "text-[#1A3A5C]";

  const inner = isMark ? (
    // Icon only
    <Mark w={s.mark.w} h={s.mark.h} color1={color1} color2={color2} />

  ) : isCompact ? (
    // Mark + stacked wordmark
    <div className="flex items-center" style={{ gap: s.gap }}>
      <Mark w={s.mark.w} h={s.mark.h} color1={color1} color2={color2} />
      <div className="flex flex-col leading-none">
        <span
          className={cn("font-serif font-bold tracking-wider", nameColor, s.name)}
          style={{ letterSpacing: "0.06em" }}
        >
          MAX
        </span>
        <span
          className={cn("font-serif font-bold tracking-wider", nameColor, s.name)}
          style={{ letterSpacing: "0.06em" }}
        >
          NOVATE
        </span>
      </div>
    </div>

  ) : (
    // Full horizontal lockup
    <div className="flex items-center" style={{ gap: s.gap }}>
      <Mark w={s.mark.w} h={s.mark.h} color1={color1} color2={color2} />
      <div className="flex flex-col leading-none">
        <span
          className={cn("font-serif font-bold tracking-wider", nameColor, s.name)}
          style={{ letterSpacing: "0.06em" }}
        >
          MAXNOVATE
        </span>
        <span
          className={cn("font-serif font-bold tracking-widest text-[#C89B2A]", s.tag)}
          style={{ letterSpacing: "0.22em" }}
        >
          CONSULTANCY
        </span>
      </div>
    </div>
  );

  if (!asLink) {
    return (
      <div className={cn("inline-flex items-center select-none", className)}>
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm",
        className
      )}
      aria-label="Maxnovate — home"
    >
      {inner}
    </Link>
  );
}
