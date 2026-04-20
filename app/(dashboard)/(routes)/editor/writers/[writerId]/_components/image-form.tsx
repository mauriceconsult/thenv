"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Writer } from "@prisma/client";
import toast from "react-hot-toast";
import { ImageIcon, Upload, Pencil, X } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { isEditor } from "@/lib/editor";
import { cn } from "@/lib/utils";
import { StudioAIButton } from "@/components/studio-ai";


// ─── Props ────────────────────────────────────────────────────────────────────

interface ImageFormProps {
  initialData: Writer;
  writerId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ImageForm = ({ initialData, writerId }: ImageFormProps) => {
  const { userId } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const canEdit = isEditor(userId);
  const hasImage = !!initialData.imageUrl;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const onUploadComplete = async (url: string) => {
    try {
      await axios.patch(`/api/writers/${writerId}`, { imageUrl: url });
      toast.success("Cover image updated.");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const onRemove = async () => {
    if (!canEdit) return;
    try {
      setIsRemoving(true);
      await axios.patch(`/api/writers/${writerId}`, { imageUrl: null });
      toast.success("Cover image removed.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsRemoving(false);
    }
  };

  const onDragEnter = useCallback(() => setIsDragging(true), []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mt-0 border border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2.5 h-2.5 border flex-shrink-0",
              hasImage
                ? "bg-foreground border-foreground"
                : "border-muted-foreground"
            )}
          />
          <span className="font-mono text-[10px] tracking-widest uppercase text-foreground">
            Cover image
          </span>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            {/* Studio AI generation — always available */}
            <StudioAIButton
              variant="inline"
              options={{
                type: "image",
                prompt: `Generate a striking, photojournalistic editorial cover image for a news beat titled "${initialData.title}"${initialData.description ? `. The beat covers: ${initialData.description}` : ""}. Style: broadsheet newspaper, high contrast, documentary photography aesthetic.`,
              }}
            />

            {isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-muted-foreground border border-border px-2.5 py-1 hover:border-foreground hover:text-foreground transition"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase text-muted-foreground border border-border px-2.5 py-1 hover:border-foreground hover:text-foreground transition"
                >
                  {hasImage ? (
                    <><Pencil className="w-3 h-3" />Replace</>
                  ) : (
                    <><Upload className="w-3 h-3" />Upload</>
                  )}
                </button>
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

      {/* Image display */}
      {!isEditing && (
        hasImage ? (
          <div className="relative aspect-video group">
            <Image
              alt="Beat cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              src={initialData.imageUrl!}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-0.5 pointer-events-none">
              <span className="font-mono text-[8px] uppercase tracking-widest text-white/60">
                Beat cover
              </span>
              <span className="font-mono text-[10px] text-white/90 truncate">
                {initialData.imageUrl!.split("/").pop()}
              </span>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-muted/30 flex flex-col items-center justify-center gap-2">
            <ImageIcon className="w-7 h-7 text-muted-foreground/30" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">
              No cover image
            </span>
          </div>
        )
      )}

      {/* Upload zone */}
      {isEditing && (
        <div
          className={cn("transition-colors", isDragging && "bg-muted/20")}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
        >
          <div className={cn("m-3 border border-dashed transition-colors", isDragging ? "border-foreground" : "border-border")}>
            <FileUpload
              endpoint="topicImage"
              onChange={(url) => { if (url) onUploadComplete(url); }}
            />
          </div>
        </div>
      )}

      {/* Studio AI block CTA — shown when no image and not editing */}
      {!isEditing && !hasImage && canEdit && (
        <StudioAIButton
          variant="block"
          className="border-t border-border"
          options={{
            type: "image",
            prompt: `Generate a striking, photojournalistic editorial cover image for a news beat titled "${initialData.title}"${initialData.description ? `. The beat covers: ${initialData.description}` : ""}. Style: broadsheet newspaper, high contrast, documentary photography aesthetic.`,
          }}
        />
      )}

      {/* Footer */}
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
