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
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  disabled = false,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  // ── Active logic ─────────────────────────────────────────────────────────
  // Root "/" only matches exactly — startsWith("/") would match everything.
  // All other routes match exactly OR as a path prefix (e.g. /editor/writers/…).
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const onClick = () => {
    if (disabled) return;
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      title={disabled ? `${label} — coming soon` : undefined}
      className={cn(
        // Base
        "relative flex items-center w-full text-sm font-medium pl-6 pr-2 transition-all",
        // Default state
        "text-muted-foreground hover:text-foreground hover:bg-muted/30",
        // Active state — editorial ink style instead of sky blue
        isActive && "text-foreground bg-muted/40 hover:bg-muted/40",
        // Disabled state
        disabled &&
          "opacity-35 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground",
      )}
    >
      {/* Icon + label */}
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

      {/* Active indicator — left border using absolute positioning avoids the h-full=0 bug */}
      <span
        className={cn(
          "absolute left-0 top-0 bottom-0 w-0.5 bg-foreground transition-opacity",
          isActive ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
};
