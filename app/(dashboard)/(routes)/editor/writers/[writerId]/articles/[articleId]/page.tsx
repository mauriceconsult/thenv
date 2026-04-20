import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, ImageIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArticleTitleForm } from "./_components/article-title-form";
import { ArticleDescriptionForm } from "./_components/article-description-form";
import { Banner } from "@/components/banner";
import { ArticleActions } from "./_components/article-actions";
import { ArticleFormatBadge } from "./_components/article-media-components";
import { MediaTabs, type MediaFormat } from "./_components/media-tabs";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Core fields every article must have before it can be published.
 * Title, description, and cover image are always required.
 */
function getCoreRequiredFields(article: {
  title: string | null;
  description: string | null;
  imageUrl: string | null;
}) {
  return [article.title, article.description, article.imageUrl];
}

/**
 * Only Video, Podcast and Interview require a primary mediaUrl before publish.
 * Gallery / Infographic manage images separately via galleryUrls.
 * Text needs nothing extra.
 */
const MEDIA_URL_REQUIRED: MediaFormat[] = ["Video", "Podcast", "Interview"];

// ─── Page ─────────────────────────────────────────────────────────────────────

const ArticleIdPage = async ({
  params,
}: {
  params: Promise<{ writerId: string; articleId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { writerId, articleId } = await params;

  const article = await db.article.findUnique({
    where: { id: articleId, writerId },
  });
  if (!article) return redirect("/");

  // Cast to extended shape — reflects the Prisma schema additions
  const extArticle = article as typeof article & {
    mediaFormat?: string | null;
    mediaUrl?: string | null;
    mediaCaption?: string | null;
    galleryUrls?: string[];
    audioUrl?: string | null;
  };

  const mediaFormat = (extArticle.mediaFormat ?? "Text") as MediaFormat;
  const needsMediaUrl = MEDIA_URL_REQUIRED.includes(mediaFormat);

  // ── Completion ─────────────────────────────────────────────────────────────
  const coreFields = getCoreRequiredFields(article);
  const mediaField = needsMediaUrl ? [extArticle.mediaUrl] : [];
  const requiredFields = [...coreFields, ...mediaField];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;
  const isComplete = requiredFields.every(Boolean);

  // ── Checklist items (derived on server, passed as plain data) ─────────────
  const checklist = [
    { label: "Headline set", done: !!article.title },
    { label: "Standfirst written", done: !!article.description },
    { label: "Cover image uploaded", done: !!article.imageUrl },
    ...(needsMediaUrl
      ? [
          {
            label: `${mediaFormat} media attached`,
            done: !!extArticle.mediaUrl,
          },
        ]
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

        {/* ── Page heading ── */}
        <div className="pb-5 mb-8 border-b-2 border-foreground flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-black text-foreground mb-1">
              Article creation
            </h1>
            <p className="font-mono text-[10px] tracking-wide text-muted-foreground">
              Details · Media · Checklist
            </p>
          </div>
          <ArticleFormatBadge format={mediaFormat} />
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: details + checklist */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b-2 border-foreground">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Article details
              </h2>
            </div>

            <ArticleTitleForm
              initialData={article}
              writer={writerId}
              articleId={articleId}
            />
            <ArticleDescriptionForm
              initialData={article}
              writerId={writerId}
              articleId={articleId}
            />

            {/* Checklist */}
            <div className="mt-8 pt-5 border-t-2 border-foreground">
              <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-3">
                Publication checklist
              </p>
              {checklist.map(({ label, done }) => (
                <ChecklistRow key={label} done={done} label={label} />
              ))}

              {/* Studio AI platform link seam */}
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
          </div>

          {/* Right: media tabs — "use client" boundary */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b-2 border-foreground">
              <IconBadge icon={ImageIcon} />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Media assets
              </h2>
            </div>

            {/*
              MediaTabs is a "use client" component.
              All tab switching happens client-side.
              Article data is passed as a plain serialisable prop — no DB calls inside.
            */}
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

// ─── Checklist row (pure UI, no state) ────────────────────────────────────────

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
      <span
        className={`text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}

export default ArticleIdPage;
