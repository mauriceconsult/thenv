"use client";

/**
 * studio-ai.tsx
 *
 * Single source of truth for all Studio AI integration points.
 *
 * TODAY  — navigates to /studio with a pre-filled prompt via URL params.
 * LATER  — swap openStudioAI() body to call your cross-app API / SDK instead.
 *          Nothing in the consuming components needs to change.
 */

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StudioGenerationType =
  | "description"   // beat or article standfirst
  | "image"         // cover image
  | "script"        // video / podcast script
  | "captions"      // gallery captions
  | "headline";     // article headline

export interface StudioAIOptions {
  type: StudioGenerationType;
  /** The context prompt sent to Studio — build this from the surrounding form's data */
  prompt: string;
  /**
   * Called with the generated value when Studio returns a result.
   * Wired up once the Studio API is live — ignored in the URL-based stub.
   */
  onResult?: (value: string) => void;
}

// ─── Core utility (swap this body when Studio API is ready) ──────────────────

export function openStudioAI(
  options: StudioAIOptions,
  router: ReturnType<typeof useRouter>
) {
  const params = new URLSearchParams({
    prompt: options.prompt,
    type: options.type,
    // returnTo lets Studio know where to send the result back
    returnTo: window.location.pathname,
  });
  router.push(`/studio?${params.toString()}`);
}

// ─── Button variants ──────────────────────────────────────────────────────────

interface StudioAIButtonProps {
  options: StudioAIOptions;
  /** "inline" sits next to a form label; "block" renders below a field as a full suggestion bar */
  variant?: "inline" | "block";
  className?: string;
}

export function StudioAIButton({
  options,
  variant = "inline",
  className,
}: StudioAIButtonProps) {
  const router = useRouter();

  const LABELS: Record<StudioGenerationType, string> = {
    description: "Generate with Studio AI",
    image:       "Generate cover with Studio AI",
    script:      "Draft script in Studio AI",
    captions:    "Write captions in Studio AI",
    headline:    "Suggest headline in Studio AI",
  };

  if (variant === "block") {
    return (
      <button
        type="button"
        onClick={() => openStudioAI(options, router)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5",
          "border border-dashed border-border",
          "bg-muted/20 hover:bg-muted/40 hover:border-foreground",
          "transition-all group",
          className
        )}
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition" />
          <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition">
            Studio AI
          </span>
        </span>
        <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition">
          {LABELS[options.type]} →
        </span>
      </button>
    );
  }

  // inline variant — sits next to a label
  return (
    <button
      type="button"
      onClick={() => openStudioAI(options, router)}
      className={cn(
        "flex items-center gap-1 font-mono text-[8px] tracking-widest uppercase",
        "text-muted-foreground hover:text-foreground transition",
        className
      )}
    >
      <Sparkles className="w-2.5 h-2.5 flex-shrink-0" />
      {LABELS[options.type]}
    </button>
  );
}
