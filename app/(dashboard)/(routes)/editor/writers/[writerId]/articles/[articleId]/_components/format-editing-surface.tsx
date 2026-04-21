"use client";

/**
 * FormatEditingSurface
 *
 * The left column of the article editor.
 * What the journalist *writes* changes entirely depending on format:
 *
 *   Text       → Headline + Standfirst + Body (rich text editor hook)
 *   Video      → Headline + Video Summary (standfirst repurposed as caption/summary)
 *   Podcast    → Headline + Show Notes (standfirst repurposed)
 *   Gallery    → Headline + Gallery Introduction
 *   Infographic→ Headline + Data Context (explanatory text)
 *   Interview  → Headline + Introduction + Q&A transcript stub
 */

import { type MediaFormat } from "./media-tabs";
import { StudioAIButton } from "@/components/studio-ai";
import { cn } from "@/lib/utils";

// ─── Per-format label overrides ────────────────────────────────────────────────

const FORMAT_COPY: Record<
  MediaFormat,
  {
    descriptionLabel: string;
    descriptionPlaceholder: string;
    descriptionHint: string;
    studioPromptSuffix: string;
    primaryMediaLabel: string;
    primaryMediaHint: string;
  }
> = {
  Text: {
    descriptionLabel: "Standfirst",
    descriptionPlaceholder:
      "A sharp 2–3 sentence summary that hooks the reader and signals the story's significance…",
    descriptionHint: "Appears below the headline in listings and at the top of the article.",
    studioPromptSuffix: "Write a sharp journalistic standfirst (2–3 sentences) that hooks the reader and signals the story's significance. Style: The Economist / NYT.",
    primaryMediaLabel: "Body copy",
    primaryMediaHint: "Open the full editor to write your article body.",
  },
  Video: {
    descriptionLabel: "Video summary",
    descriptionPlaceholder:
      "Briefly describe what this video report covers and why it matters to the reader…",
    descriptionHint: "Displayed below the video player. Should describe the report without duplicating the video.",
    studioPromptSuffix: "Write a 2–3 sentence video summary that describes the report and explains why it matters. The summary appears below the video player.",
    primaryMediaLabel: "Video embed",
    primaryMediaHint: "Paste a YouTube or Vimeo URL in the Media tab.",
  },
  Podcast: {
    descriptionLabel: "Show notes",
    descriptionPlaceholder:
      "Summarise the episode, name key guests, and list any resources mentioned…",
    descriptionHint: "Displayed alongside the audio player. Include guest names, key topics, and links.",
    studioPromptSuffix: "Write podcast show notes (3–4 sentences) summarising the episode, naming key themes, and encouraging the reader to listen.",
    primaryMediaLabel: "Audio file",
    primaryMediaHint: "Upload your MP3 or WAV in the Media tab.",
  },
  Gallery: {
    descriptionLabel: "Gallery introduction",
    descriptionPlaceholder:
      "Set the scene for the photo essay — what is the reader about to see, and why does it matter?",
    descriptionHint: "Appears before the first image. Should contextualise the series.",
    studioPromptSuffix: "Write a gallery introduction (2–3 sentences) that sets the scene and explains the significance of the photo essay.",
    primaryMediaLabel: "Gallery images",
    primaryMediaHint: "Upload your images in the Media tab.",
  },
  Infographic: {
    descriptionLabel: "Data context",
    descriptionPlaceholder:
      "Explain the data being visualised — what does it show, where does it come from, and what should the reader take away?",
    descriptionHint: "Appears below the infographic. Should guide the reader's interpretation.",
    studioPromptSuffix: "Write a 2–3 sentence data context note explaining what the infographic shows, the source of the data, and the key takeaway.",
    primaryMediaLabel: "Infographic images",
    primaryMediaHint: "Upload your infographic images in the Media tab.",
  },
  Interview: {
    descriptionLabel: "Introduction",
    descriptionPlaceholder:
      "Introduce the interviewee — who are they, why are they relevant now, and what does this conversation reveal?",
    descriptionHint: "Appears before the transcript or audio. Should establish the subject's relevance.",
    studioPromptSuffix: "Write an interview introduction (2–3 sentences) that introduces the subject, establishes their relevance, and previews the conversation's key insights.",
    primaryMediaLabel: "Audio / video",
    primaryMediaHint: "Embed or upload the interview recording in the Media tab.",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface FormatEditingSurfaceProps {
  format: MediaFormat;
  articleTitle: string | null;
  beatTitle?: string | null;
  /** Slot for the actual ArticleTitleForm component (passed from server parent) */
  titleFormSlot: React.ReactNode;
  /** Slot for the ArticleDescriptionForm component (passed from server parent) */
  descriptionFormSlot: React.ReactNode;
  /** Slot for the publication checklist (passed from server parent) */
  checklistSlot: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FormatEditingSurface({
  format,
  articleTitle,
  beatTitle,
  titleFormSlot,
  descriptionFormSlot,
  checklistSlot,
}: FormatEditingSurfaceProps) {
  const copy = FORMAT_COPY[format];

  return (
    <div>
      {/* Format-specific writing guidance */}
      <div className="mb-4 px-3 py-2.5 bg-muted/20 border border-dashed border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8px] tracking-widest uppercase text-muted-foreground mb-0.5">
              Primary content — {format}
            </p>
            <p className="font-serif text-xs italic text-muted-foreground">
              {copy.primaryMediaHint}
            </p>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">
            {copy.primaryMediaLabel}
          </span>
        </div>
      </div>

      {/* Headline — always present */}
      {titleFormSlot}

      {/* Description with format-aware label — passed as slot so the actual
          ArticleDescriptionForm keeps its own edit/save/Studio AI state */}
      <div className="mt-0">
        {/* Label override banner — sits above the form */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/10 border-x border-t border-border">
          <span className="font-mono text-[8px] tracking-widest uppercase text-muted-foreground">
            {copy.descriptionLabel}
          </span>
          <span className="font-serif text-[10px] italic text-muted-foreground hidden sm:block">
            {copy.descriptionHint}
          </span>
        </div>
        {descriptionFormSlot}
      </div>

      {/* Format-specific body hint */}
      {format === "Text" && (
        <BodyEditorStub articleTitle={articleTitle} beatTitle={beatTitle} />
      )}

      {format === "Interview" && (
        <TranscriptStub articleTitle={articleTitle} />
      )}

      {/* Checklist */}
      {checklistSlot}
    </div>
  );
}

// ─── Body editor stub (Text format) ──────────────────────────────────────────
// Replace with your rich text editor (Tiptap, Lexical, etc.) when ready.

function BodyEditorStub({
  articleTitle,
  beatTitle,
}: {
  articleTitle: string | null;
  beatTitle?: string | null;
}) {
  return (
    <div className="mt-0 border border-border bg-background">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 border border-muted-foreground flex-shrink-0" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-foreground">
            Body copy
          </span>
        </div>
        <StudioAIButton
          variant="inline"
          options={{
            type: "script",
            prompt: [
              `Draft the body of a long-form news article titled "${articleTitle}".`,
              beatTitle ? `This article belongs to the "${beatTitle}" beat.` : "",
              "Write in the authoritative editorial style of The Economist. Include section breaks. 600–900 words.",
            ]
              .filter(Boolean)
              .join(" "),
          }}
        />
      </div>
      <div className="aspect-[4/2] flex flex-col items-center justify-center gap-2 bg-muted/10 cursor-pointer hover:bg-muted/20 transition group">
        <span className="font-mono text-[28px] text-muted-foreground/20 group-hover:text-muted-foreground/40 transition select-none">
          ¶
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">
          Open full editor
        </span>
      </div>
    </div>
  );
}

// ─── Transcript stub (Interview format) ──────────────────────────────────────

function TranscriptStub({ articleTitle }: { articleTitle: string | null }) {
  return (
    <div className="mt-0 border border-border bg-background">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 border border-muted-foreground flex-shrink-0" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-foreground">
            Q&A transcript
          </span>
        </div>
        <StudioAIButton
          variant="inline"
          options={{
            type: "script",
            prompt: `Draft a Q&A interview transcript structure for an article titled "${articleTitle}". Include 5–7 questions with brief interviewer notes. Use a journalistic, probing tone.`,
          }}
        />
      </div>
      <div className="px-3.5 py-4 space-y-3">
        {[
          { q: "Question 1", a: "" },
          { q: "Question 2", a: "" },
        ].map((item, i) => (
          <div
            key={i}
            className={cn(
              "border-l-2 pl-3 py-1",
              i % 2 === 0 ? "border-foreground" : "border-border"
            )}
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
              {i % 2 === 0 ? "Q" : "A"}
            </p>
            <p className="font-serif text-xs italic text-muted-foreground/50">
              {item.q}
            </p>
          </div>
        ))}
        <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40 text-center pt-2">
          Add questions in the full editor
        </p>
      </div>
    </div>
  );
}
