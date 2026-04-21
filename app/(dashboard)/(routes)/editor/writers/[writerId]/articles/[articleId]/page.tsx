import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, ImageIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Article } from "@prisma/client";
import { ArticleTitleForm } from "./_components/article-title-form";
import { ArticleDescriptionForm } from "./_components/article-description-form";
import { Banner } from "@/components/banner";
import { ArticleActions } from "./_components/article-actions";
import { MediaTabs, type MediaFormat } from "./_components/media-tabs";
import { FormatSwitcher } from "./_components/format-switcher";
import { FormatEditingSurface } from "./_components/format-editing-surface";

// ─── Format completion rules ──────────────────────────────────────────────────

const MEDIA_URL_REQUIRED: MediaFormat[] = ["Video", "Podcast", "Interview"];

// ─── Extended article type ────────────────────────────────────────────────────
// Extends the Prisma Article type with the new media fields.
// The intersection keeps title/description/etc in sync with the generated type
// so MediaTabs and other consumers never see a nullability mismatch.
// Remove the cast in the page body once the Prisma schema is migrated.

type ExtendedArticle = Article & {
  mediaFormat?: string | null;
  mediaUrl?: string | null;
  mediaCaption?: string | null;
  galleryUrls?: string[];
  audioUrl?: string | null;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ArticleIdPage = async ({
  params,
}: {
  params: Promise<{ writerId: string; articleId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { writerId, articleId } = await params;

  // Fetch article and its parent beat in parallel
  const [article, writer] = await Promise.all([
    db.article.findUnique({ where: { id: articleId, writerId } }),
    db.writer.findUnique({
      where: { id: writerId },
      select: { title: true },
    }),
  ]);

  if (!article) return redirect("/");

  const extArticle = article as unknown as ExtendedArticle;
  const mediaFormat = (extArticle.mediaFormat ?? "Text") as MediaFormat;
  const needsMediaUrl = MEDIA_URL_REQUIRED.includes(mediaFormat);
  const beatTitle = writer?.title ?? undefined;

  // ── Completion ─────────────────────────────────────────────────────────────
  const requiredFields = [
    article.title,
    article.description,
    article.imageUrl,
    ...(needsMediaUrl ? [extArticle.mediaUrl] : []),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;
  const isComplete = requiredFields.every(Boolean);

  // ── Checklist (computed server-side, no client state needed) ───────────────
  const checklist: { label: string; done: boolean }[] = [
    { label: "Headline set",         done: !!article.title },
    { label: "Standfirst written",   done: !!article.description },
    { label: "Cover image uploaded", done: !!article.imageUrl },
    ...(needsMediaUrl
      ? [{ label: `${mediaFormat} media attached`, done: !!extArticle.mediaUrl }]
      : []),
  ];

  return (
    <>
      {!article.isPublished && (
        <Banner
          variant="warning"
          label="This article is unpublished. It will not be visible in the beat."
        />
      )}

      <div className="p-6 max-w-6xl">

        {/* ── Top nav ── */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/editor/writers/${writerId}`}
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to beat setup
          </Link>

          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-[10px] tracking-wide border px-2.5 py-1 ${
                isComplete
                  ? "border-foreground text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {completionText} fields
            </span>
            <ArticleActions
              disabled={!isComplete}
              writerId={writerId}
              articleId={articleId}
              isPublished={article.isPublished}
            />
          </div>
        </div>

        {/* ── Page heading with format switcher ── */}
        <div className="pb-5 mb-8 border-b-2 border-foreground flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-black text-foreground mb-1">
              {article.title ?? "Untitled article"}
            </h1>
            <p className="font-mono text-[10px] tracking-wide text-muted-foreground">
              {beatTitle ? `${beatTitle} · ` : ""}Details · Media · Checklist
            </p>
          </div>

          {/*
            FormatSwitcher is "use client".
            Changing format PATCHes the article and triggers router.refresh(),
            which re-runs this server component with the new format.
          */}
          <FormatSwitcher
            currentFormat={mediaFormat}
            writerId={writerId}
            articleId={articleId}
            articleTitle={article.title}
          />
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Left: format-aware editing surface ── */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b-2 border-foreground">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Article details
              </h2>
            </div>

            {/*
              FormatEditingSurface is "use client" but receives its interactive
              sub-forms as React children (slots), keeping data-fetching on the
              server and interactivity at the leaf level.
            */}
            <FormatEditingSurface
              format={mediaFormat}
              articleTitle={article.title}
              beatTitle={beatTitle}
              titleFormSlot={
                <ArticleTitleForm
                  initialData={article}
                  writer={writerId}
                  articleId={articleId}
                />
              }
              descriptionFormSlot={
                <ArticleDescriptionForm
                  initialData={article}
                  writerId={writerId}
                  articleId={articleId}
                  beatTitle={beatTitle}
                />
              }
              checklistSlot={
                <div className="mt-8 pt-5 border-t-2 border-foreground">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-3">
                    Publication checklist
                  </p>
                  {checklist.map(({ label, done }) => (
                    <ChecklistRow key={label} done={done} label={label} />
                  ))}

                  {/* Studio AI platform link */}
                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="font-mono text-[8px] tracking-widest uppercase text-muted-foreground mb-2">
                      Connected platform
                    </p>
                    <a
                      href="/studio"
                      className="flex items-center justify-between px-3 py-2 border border-dashed border-border hover:border-foreground transition group"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition">
                        Studio AI
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition">
                        Open →
                      </span>
                    </a>
                  </div>
                </div>
              }
            />
          </div>

          {/* ── Right: media tabs ── */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b-2 border-foreground">
              <IconBadge icon={ImageIcon} />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Media assets
              </h2>
            </div>

            <MediaTabs
              writerId={writerId}
              articleId={articleId}
              article={extArticle}
              mediaFormat={mediaFormat}
            />
          </div>

        </div>
      </div>
    </>
  );
};

// ─── Checklist row ─────────────────────────────────────────────────────────────

function ChecklistRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-border last:border-0">
      <div
        className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${
          done ? "bg-foreground border-foreground" : "border-muted-foreground"
        }`}
      >
        {done && (
          <svg
            className="w-2 h-2 text-background"
            viewBox="0 0 8 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M1 4l2 2 4-4" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}

export default ArticleIdPage;
