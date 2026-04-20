"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Article } from "@prisma/client";
import toast from "react-hot-toast";
import { ImageIcon, Upload, Pencil, X } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { isEditor } from "@/lib/editor";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleImageFormProps {
  initialData: Article;
  writerId: string;
  articleId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  imageUrl: z.string().min(1),
});

// ─── Component ────────────────────────────────────────────────────────────────

export const ArticleImageForm = ({
  initialData,
  writerId,
  articleId,
}: ArticleImageFormProps) => {
  const { userId } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const canEdit = isEditor(userId);
  const hasImage = !!initialData.imageUrl;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const toggleEdit = useCallback(() => setIsEditing((c) => !c), []);

  /** Called by FileUpload once the upload provider returns a URL */
  const onUploadComplete = async (url: string) => {
    try {
      await axios.patch(`/api/writers/${writerId}/articles/${articleId}`, {
        imageUrl: url,
      });
      toast.success("Cover image updated.");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  /** Remove the current image entirely */
  const onRemove = async () => {
    if (!canEdit) return;
    try {
      setIsRemoving(true);
      await axios.patch(`/api/writers/${writerId}/articles/${articleId}`, {
        imageUrl: null,
      });
      toast.success("Cover image removed.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsRemoving(false);
    }
  };

  // ── Drag-over styling (visual only — actual drop is handled by FileUpload) ─

  const onDragEnter = useCallback(() => setIsDragging(true), []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mt-0 border border-border bg-background">

      {/* ── Panel header ── */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          {/* Completion indicator */}
          <div
            className={cn(
              "w-2.5 h-2.5 border flex-shrink-0 flex items-center justify-center transition-colors",
              hasImage
                ? "bg-foreground border-foreground"
                : "border-muted-foreground"
            )}
          >
            {hasImage && (
              <svg
                className="w-1.5 h-1.5 text-background"
                viewBox="0 0 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M1 3l1.5 1.5L5 1" />
              </svg>
            )}
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-foreground">
            Cover image
          </span>
        </div>

        {/* Action buttons — only shown to editors */}
        {canEdit && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={toggleEdit}
                className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-muted-foreground border border-border px-2.5 py-1 hover:border-foreground hover:text-foreground transition"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
            ) : (
              <>
                <button
                  onClick={toggleEdit}
                  className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase text-muted-foreground border border-border px-2.5 py-1 hover:border-foreground hover:text-foreground transition"
                >
                  {hasImage ? (
                    <>
                      <Pencil className="w-3 h-3" />
                      Replace
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3" />
                      Upload
                    </>
                  )}
                </button>

                {/* Remove button — only if image exists */}
                {hasImage && (
                  <button
                    onClick={onRemove}
                    disabled={isRemoving}
                    className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-muted-foreground border border-border px-2.5 py-1 hover:border-destructive hover:text-destructive transition disabled:opacity-40"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Image display ── */}
      {!isEditing && (
        hasImage ? (
          <div className="relative aspect-video group">
            <Image
              alt="Article cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              src={initialData.imageUrl!}
              priority
            />
            {/* Hover overlay with filename hint */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-0.5 pointer-events-none">
              <span className="font-mono text-[8px] uppercase tracking-widest text-white/60">
                Cover image
              </span>
              <span className="font-mono text-[10px] text-white/90 truncate">
                {initialData.imageUrl!.split("/").pop()}
              </span>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="aspect-video bg-muted/30 flex flex-col items-center justify-center gap-2">
            <ImageIcon className="w-7 h-7 text-muted-foreground/30" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">
              No cover image
            </span>
          </div>
        )
      )}

      {/* ── Upload state ── */}
      {isEditing && (
        <div
          className={cn(
            "p-0 transition-colors",
            isDragging && "bg-muted/20"
          )}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
        >
          <div
            className={cn(
              "m-3 border border-dashed transition-colors",
              isDragging ? "border-foreground" : "border-border"
            )}
          >
            <FileUpload
              endpoint="topicImage"
              onChange={(url) => {
                if (url) onUploadComplete(url);
              }}
            />
          </div>
        </div>
      )}

      {/* ── Footer meta ── */}
      <div className="flex items-center justify-between px-3.5 py-2 border-t border-border">
        <span className="font-mono text-[9px] text-muted-foreground tracking-wide">
          {hasImage ? "✓ Image set" : "Required"}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground tracking-wide">
          16:9 · JPG PNG WebP · max 5 MB
        </span>
      </div>
    </div>
  );
};
