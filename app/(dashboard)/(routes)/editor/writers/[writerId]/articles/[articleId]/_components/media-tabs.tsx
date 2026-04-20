"use client";

import { useState } from "react";
import { ImageIcon, FileVideo, Images, Mic, Link2 } from "lucide-react";
import { ArticleImageForm } from "./article-image-form";
import {
  ArticleEmbedForm,
  ArticleGalleryForm,
  ArticleAudioForm,
} from "./article-media-components";
import { cn } from "@/lib/utils";
import { Article } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MediaFormat =
  | "Text"
  | "Video"
  | "Podcast"
  | "Gallery"
  | "Infographic"
  | "Interview";

type TabId = "cover" | "embed" | "gallery" | "audio";

interface Tab {
  id: TabId;
  label: string;
  icon: typeof ImageIcon;
  /** Tooltip shown on hover */
  hint: string;
}

interface MediaTabsProps {
  writerId: string;
  articleId: string;
  article: Article & {
    mediaFormat?: string | null;
    mediaUrl?: string | null;
    mediaCaption?: string | null;
    galleryUrls?: string[];
    audioUrl?: string | null;
  };
  mediaFormat?: MediaFormat;
  /** Callback so the parent checklist can react to mediaUrl being set */
  onMediaChange?: (hasMedia: boolean) => void;
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const ALL_TABS: Record<TabId, Tab> = {
  cover: {
    id: "cover",
    label: "Cover",
    icon: ImageIcon,
    hint: "Required — 16:9 hero image shown in listings and social previews",
  },
  embed: {
    id: "embed",
    label: "Embed",
    icon: FileVideo,
    hint: "YouTube, Vimeo, Spotify, SoundCloud or X/Twitter",
  },
  gallery: {
    id: "gallery",
    label: "Gallery",
    icon: Images,
    hint: "Up to 20 images displayed as an inline photo essay",
  },
  audio: {
    id: "audio",
    label: "Audio",
    icon: Mic,
    hint: "MP3, WAV or OGG — up to 50 MB. Transcript upload available after.",
  },
};

/** Which tabs are available per format */
const FORMAT_TABS: Record<MediaFormat, TabId[]> = {
  Text: ["cover"],
  Infographic: ["cover", "gallery"],
  Video: ["cover", "embed"],
  Podcast: ["cover", "embed", "audio"],
  Interview: ["cover", "embed", "audio"],
  Gallery: ["cover", "gallery"],
};

// ─── Component ────────────────────────────────────────────────────────────────

export function MediaTabs({
  writerId,
  articleId,
  article,
  mediaFormat = "Text",
}: MediaTabsProps) {
  const tabIds = FORMAT_TABS[mediaFormat] ?? ["cover"];
  const tabs = tabIds.map((id) => ALL_TABS[id]);
  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);

  // Keep active tab valid if mediaFormat changes (e.g. after a format switch)
  const safeActive = tabIds.includes(activeTab) ? activeTab : tabs[0].id;

  return (
    <div>
      {/* ── Tab bar ── */}
      <div
        className="flex border-b border-border mb-0"
        role="tablist"
        aria-label="Media asset panels"
      >
        {tabs.map(({ id, label, icon: Icon, hint }) => (
          <button
            key={id}
            role="tab"
            aria-selected={safeActive === id}
            aria-controls={`panel-${id}`}
            title={hint}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase px-3 py-2.5 border-b-2 transition-all",
              safeActive === id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            <Icon className="w-3 h-3 flex-shrink-0" />
            {label}
            {/* Required dot on cover tab */}
            {id === "cover" && !article.imageUrl && (
              <span className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
            )}
            {/* Required dot on embed/audio for media formats */}
            {(id === "embed" || id === "audio") && !article.mediaUrl && (
              <span className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* ── Panels ── */}
      {/* Cover — always present */}
      <div
        id="panel-cover"
        role="tabpanel"
        hidden={safeActive !== "cover"}
        className="pt-4"
      >
        <ArticleImageForm
          initialData={article}
          writerId={writerId}
          articleId={articleId}
        />
        {/* Studio AI connection point — cover image can be AI-generated */}
        <StudioAIHint
          prompt={`Generate a photojournalistic cover image for: "${article.title}"`}
          type="image"
        />
      </div>

      {/* Embed */}
      {tabIds.includes("embed") && (
        <div
          id="panel-embed"
          role="tabpanel"
          hidden={safeActive !== "embed"}
          className="pt-4"
        >
          <ArticleEmbedForm
            initialData={article}
            writerId={writerId}
            articleId={articleId}
            format={mediaFormat as "Video" | "Podcast" | "Interview"}
          />
          <StudioAIHint
            prompt={`Write a script for a ${mediaFormat?.toLowerCase()} segment about: "${article.title}"`}
            type="script"
          />
        </div>
      )}

      {/* Gallery */}
      {tabIds.includes("gallery") && (
        <div
          id="panel-gallery"
          role="tabpanel"
          hidden={safeActive !== "gallery"}
          className="pt-4"
        >
          <ArticleGalleryForm
            initialData={article}
            writerId={writerId}
            articleId={articleId}
          />
          <StudioAIHint
            prompt={`Generate captions for a photo gallery about: "${article.title}"`}
            type="captions"
          />
        </div>
      )}

      {/* Audio */}
      {tabIds.includes("audio") && (
        <div
          id="panel-audio"
          role="tabpanel"
          hidden={safeActive !== "audio"}
          className="pt-4"
        >
          <ArticleAudioForm
            initialData={article}
            writerId={writerId}
            articleId={articleId}
          />
          <StudioAIHint
            prompt={`Write a podcast intro and outro for: "${article.title}"`}
            type="script"
          />
        </div>
      )}
    </div>
  );
}

// ─── Studio AI connection seam ────────────────────────────────────────────────
// This component is the integration point for the Studio AI app.
// Replace the href / onClick with your cross-app navigation or API call.

interface StudioAIHintProps {
  prompt: string;
  type: "image" | "script" | "captions";
}

const STUDIO_LABELS: Record<StudioAIHintProps["type"], string> = {
  image: "Generate with Studio AI →",
  script: "Draft script in Studio AI →",
  captions: "Write captions in Studio AI →",
};

function StudioAIHint({ prompt, type }: StudioAIHintProps) {
  return (
    <div className="mt-3 flex items-center justify-between px-3 py-2 border border-dashed border-border bg-muted/20">
      <span className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
        Studio AI
      </span>
      <a
        // TODO: replace with your Studio AI deep-link once apps are connected
        href={`/studio?prompt=${encodeURIComponent(prompt)}&type=${type}`}
        className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition"
      >
        <Link2 className="w-3 h-3" />
        {STUDIO_LABELS[type]}
      </a>
    </div>
  );
}
