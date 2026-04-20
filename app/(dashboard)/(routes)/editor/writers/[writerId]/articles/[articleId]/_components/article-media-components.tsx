// ─────────────────────────────────────────────────────────────────────────────
// article-embed-form.tsx
// Handles YouTube, Vimeo, Spotify, SoundCloud embed URLs
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form, FormControl, FormField, FormItem, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Article } from "@prisma/client";

type ArticleWithMedia = Article & { mediaUrl?: string | null; mediaCaption?: string | null };

const EMBED_PLATFORMS: Record<string, RegExp> = {
  YouTube: /youtube\.com|youtu\.be/,
  Vimeo: /vimeo\.com/,
  Spotify: /spotify\.com/,
  SoundCloud: /soundcloud\.com/,
  "Twitter/X": /twitter\.com|x\.com/,
};

const schema = z.object({
  mediaUrl: z.string().url({ message: "Enter a valid URL" }),
  mediaCaption: z.string().optional(),
});

interface ArticleEmbedFormProps {
  initialData: ArticleWithMedia;
  writerId: string;
  articleId: string;
  format: "Video" | "Podcast" | "Interview";
}

export const ArticleEmbedForm = ({
  initialData, writerId, articleId, format,
}: ArticleEmbedFormProps) => {
  const [isEditing, setIsEditing] = useState(!initialData.mediaUrl);
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      mediaUrl: initialData.mediaUrl ?? "",
      mediaCaption: initialData.mediaCaption ?? "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const detectedPlatform = (url: string) =>
    Object.entries(EMBED_PLATFORMS).find(([, re]) => re.test(url))?.[0];

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await axios.patch(`/api/writers/${writerId}/articles/${articleId}`, values);
      toast.success("Embed URL saved.");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const currentUrl = form.watch("mediaUrl");
  const platform = currentUrl ? detectedPlatform(currentUrl) : null;

  return (
    <div className="border border-border p-4 bg-background">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
          {format} embed
        </span>
        {!isEditing && initialData.mediaUrl && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wide text-muted-foreground hover:text-foreground transition"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
        )}
      </div>

      {!isEditing && initialData.mediaUrl ? (
        <div>
          <p className="font-mono text-[10px] text-foreground break-all">{initialData.mediaUrl}</p>
          {platform && (
            <p className="font-mono text-[9px] text-muted-foreground mt-1">
              Detected: {platform}
            </p>
          )}
          {initialData.mediaCaption && (
            <p className="font-serif text-xs italic text-muted-foreground mt-2">{initialData.mediaCaption}</p>
          )}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="mediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Paste YouTube, Vimeo, Spotify or SoundCloud URL…"
                      className="border-0 border-b border-foreground rounded-none bg-transparent font-mono text-xs placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
                      {...field}
                    />
                  </FormControl>
                  {platform && (
                    <p className="font-mono text-[9px] text-emerald-600">✓ {platform} detected</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaCaption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Caption (optional)…"
                      className="border-0 border-b border-border rounded-none bg-transparent font-serif italic text-sm placeholder:text-muted-foreground/40 focus-visible:ring-0 px-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2 pt-1">
              {initialData.mediaUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="font-mono text-[9px] uppercase tracking-wide rounded-none"
                >
                  Cancel
                </Button>
              )}
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                size="sm"
                className="font-mono text-[9px] uppercase tracking-wide rounded-none"
              >
                Save embed
              </Button>
            </div>
          </form>
        </Form>
      )}

      <p className="font-mono text-[8px] text-muted-foreground mt-3 tracking-wide">
        Supported: YouTube · Vimeo · Spotify · SoundCloud · Twitter/X
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// article-gallery-form.tsx
// Multi-image gallery upload for Gallery / Infographic articles
// ─────────────────────────────────────────────────────────────────────────────
export const ArticleGalleryForm = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialData, writerId, articleId,
}: {
  initialData: Article & { galleryUrls?: string[] };
  writerId: string;
  articleId: string;
}) => {
  // In production: integrate with your file upload provider (UploadThing, Cloudinary, etc.)
  // and PATCH /api/writers/:writerId/articles/:articleId with { galleryUrls: string[] }
  return (
    <div className="border border-dashed border-border p-6 flex flex-col items-center gap-3 bg-muted/20 cursor-pointer hover:border-foreground transition group">
      <svg className="w-8 h-8 opacity-20 group-hover:opacity-40 transition" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Add gallery images
      </p>
      <p className="font-serif text-xs italic text-muted-foreground">
        Drag &amp; drop or click to upload multiple
      </p>
      <p className="font-mono text-[8px] text-muted-foreground tracking-wide">
        Up to 20 images · JPG, PNG, WebP · 10 MB each
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// article-audio-form.tsx
// Audio file upload for Podcast / Interview articles
// ─────────────────────────────────────────────────────────────────────────────
export const ArticleAudioForm = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialData, writerId, articleId,
}: {
  initialData: Article & { audioUrl?: string | null };
  writerId: string;
  articleId: string;
}) => {
  return (
    <div className="space-y-3">
      <div className="border border-dashed border-border p-6 flex flex-col items-center gap-3 bg-muted/20 cursor-pointer hover:border-foreground transition group">
        <svg className="w-8 h-8 opacity-20 group-hover:opacity-40 transition" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="9" opacity="0.3" />
          <path d="M10 8l6 4-6 4V8z" />
        </svg>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Upload audio file
        </p>
        <p className="font-mono text-[8px] text-muted-foreground tracking-wide">
          MP3, WAV, OGG · Max 50 MB
        </p>
      </div>
      <p className="font-mono text-[9px] text-muted-foreground tracking-wide">
        Transcript upload available after audio is attached.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// article-format-badge.tsx
// Small indicator showing the article's media format
// ─────────────────────────────────────────────────────────────────────────────
const FORMAT_STYLES: Record<string, string> = {
  Text:        "bg-emerald-100 text-emerald-800 border-emerald-200",
  Video:       "bg-blue-100 text-blue-800 border-blue-200",
  Podcast:     "bg-purple-100 text-purple-800 border-purple-200",
  Gallery:     "bg-amber-100 text-amber-800 border-amber-200",
  Infographic: "bg-rose-100 text-rose-800 border-rose-200",
  Interview:   "bg-teal-100 text-teal-800 border-teal-200",
};

export const ArticleFormatBadge = ({ format }: { format: string }) => (
  <span
    className={`font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 border ${
      FORMAT_STYLES[format] ?? "bg-muted text-muted-foreground border-border"
    }`}
  >
    {format}
  </span>
);
