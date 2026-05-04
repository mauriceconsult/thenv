"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  /** Renders the item as non-interactive for platform apps not yet deployed */
  disabled?: boolean;
  /** Opens in a new tab — renders an <a> instead of a <button> */
  external?: boolean;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  disabled  = false,
  external  = false,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router   = useRouter();

  // ── Active logic ─────────────────────────────────────────────────────────
  // External links are never "active" — they live outside this app.
  // Root "/" only matches exactly — startsWith("/") would match everything.
  const isActive = external
    ? false
    : href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // ── Shared inner content ─────────────────────────────────────────────────
  const inner = (
    <div className="flex items-center gap-x-2 py-3.5">
      <Icon
        size={18}
        className={cn(
          "flex-shrink-0 transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      />
      <span className="font-mono text-[10px] tracking-widest uppercase leading-none">
        {label}
      </span>
      {disabled && (
        <span className="font-mono text-[7px] tracking-widest uppercase text-muted-foreground/50 ml-1">
          soon
        </span>
      )}
    </div>
  );

  // ── Shared className ─────────────────────────────────────────────────────
  const baseClass = cn(
    "relative flex items-center w-full text-sm font-medium pl-6 pr-2 transition-all",
    "text-muted-foreground hover:text-foreground hover:bg-muted/30",
    isActive  && "text-foreground bg-muted/40 hover:bg-muted/40",
    disabled  && "opacity-35 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground",
  );

  // ── Active indicator ─────────────────────────────────────────────────────
  const activeBar = (
    <span
      className={cn(
        "absolute left-0 top-0 bottom-0 w-0.5 bg-foreground transition-opacity",
        isActive ? "opacity-100" : "opacity-0",
      )}
    />
  );

  // ── External → render <a> ─────────────────────────────────────────────────
  if (external) {
    return (
      <a
        href={disabled ? undefined : href}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={disabled}
        title={disabled ? `${label} — coming soon` : `${label} (opens in new tab)`}
        className={baseClass}
        // Prevent navigation if somehow clicked while disabled
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {inner}
        {activeBar}
      </a>
    );
  }

  // ── Internal → render <button> ────────────────────────────────────────────
  return (
    <button
      onClick={() => { if (!disabled) router.push(href); }}
      type="button"
      disabled={disabled}
      title={disabled ? `${label} — coming soon` : undefined}
      className={baseClass}
    >
      {inner}
      {activeBar}
    </button>
  );
};
