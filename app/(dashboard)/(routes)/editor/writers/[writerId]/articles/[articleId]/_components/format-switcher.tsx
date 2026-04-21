"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { MediaFormat } from "./media-tabs";

// ─── Format metadata ──────────────────────────────────────────────────────────

export const FORMAT_META: Record<
  MediaFormat,
  { label: string; description: string; icon: string }
> = {
  Text: {
    label: "Text",
    description: "Prose article with optional inline media",
    icon: "¶",
  },
  Video: {
    label: "Video",
    description: "Video report with a written summary",
    icon: "▶",
  },
  Podcast: {
    label: "Podcast",
    description: "Audio episode with show notes",
    icon: "◎",
  },
  Gallery: {
    label: "Gallery",
    description: "Photo essay with captions",
    icon: "⊞",
  },
  Infographic: {
    label: "Infographic",
    description: "Data visuals with explanatory text",
    icon: "◈",
  },
  Interview: {
    label: "Interview",
    description: "Q&A transcript with audio or video",
    icon: "⇌",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface FormatSwitcherProps {
  currentFormat: MediaFormat;
  writerId: string;
  articleId: string;
  /** Article title — used in the confirmation message */
  articleTitle?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FormatSwitcher({
  currentFormat,
  writerId,
  articleId,
  articleTitle,
}: FormatSwitcherProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<MediaFormat>(currentFormat);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formats = Object.keys(FORMAT_META) as MediaFormat[];

  const handleSelect = async (format: MediaFormat) => {
    if (format === selected) {
      setIsOpen(false);
      return;
    }

    // Warn if switching away from a format that may have media attached
    const mediaFormats: MediaFormat[] = ["Video", "Podcast", "Interview", "Gallery"];
    if (mediaFormats.includes(selected)) {
      const confirmed = window.confirm(
        `Switching from ${selected} to ${format} will not delete your existing media, but the ${selected} panel will be hidden. Continue?`
      );
      if (!confirmed) return;
    }

    try {
      setIsSaving(true);
      setSelected(format);
      await axios.patch(`/api/writers/${writerId}/articles/${articleId}`, {
        mediaFormat: format,
      });
      toast.success(`Format set to ${format}.`);
      setIsOpen(false);
      router.refresh();
    } catch {
      setSelected(currentFormat); // revert on error
      toast.error("Could not update format.");
    } finally {
      setIsSaving(false);
    }
  };

  const current = FORMAT_META[selected];

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        disabled={isSaving}
        className={cn(
          "flex items-center gap-3 px-3 py-2 border transition-all",
          isOpen
            ? "border-foreground bg-background"
            : "border-border hover:border-foreground bg-background",
          isSaving && "opacity-50 pointer-events-none"
        )}
      >
        <span className="font-mono text-base leading-none text-foreground w-4 text-center select-none">
          {current.icon}
        </span>
        <div className="text-left">
          <p className="font-mono text-[10px] tracking-widest uppercase text-foreground leading-none mb-0.5">
            {current.label}
          </p>
          <p className="font-mono text-[8px] tracking-wide text-muted-foreground leading-none">
            {current.description}
          </p>
        </div>
        <span className="font-mono text-[9px] text-muted-foreground ml-2">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 w-72 border border-foreground bg-background shadow-none">
            <div className="px-3 py-2 border-b border-border">
              <p className="font-mono text-[8px] tracking-widest uppercase text-muted-foreground">
                Article format
                {articleTitle && (
                  <span className="ml-1 text-foreground">
                    — {articleTitle.slice(0, 28)}{articleTitle.length > 28 ? "…" : ""}
                  </span>
                )}
              </p>
            </div>

            {formats.map((fmt) => {
              const meta = FORMAT_META[fmt];
              const isActive = fmt === selected;
              return (
                <button
                  key={fmt}
                  onClick={() => handleSelect(fmt)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 border-b border-border last:border-0 transition-colors text-left",
                    isActive
                      ? "bg-foreground text-background"
                      : "hover:bg-muted/40"
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-base leading-none w-4 text-center select-none flex-shrink-0",
                      isActive ? "text-background" : "text-foreground"
                    )}
                  >
                    {meta.icon}
                  </span>
                  <div>
                    <p
                      className={cn(
                        "font-mono text-[10px] tracking-widest uppercase leading-none mb-0.5",
                        isActive ? "text-background" : "text-foreground"
                      )}
                    >
                      {meta.label}
                    </p>
                    <p
                      className={cn(
                        "font-mono text-[8px] tracking-wide leading-none",
                        isActive ? "text-background/70" : "text-muted-foreground"
                      )}
                    >
                      {meta.description}
                    </p>
                  </div>
                  {isActive && (
                    <span className="ml-auto font-mono text-[8px] text-background/70">
                      active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
