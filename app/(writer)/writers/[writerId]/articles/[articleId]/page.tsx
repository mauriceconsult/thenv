import { getArticle } from "@/actions/get-article";
import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

// ─── HTML sanitisation ────────────────────────────────────────────────────────
// The description may have been saved as rich HTML from a previous editor.
// We strip tags for the standfirst (plain text) but preserve the body.
// In production replace with a proper sanitiser like `sanitize-html` or `DOMPurify`.

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ArticleIdPage = async ({
  params,
}: {
  params: Promise<{ writerId: string; articleId: string }>;
}) => {
  const { writerId, articleId } = await params;

  // Auth is optional here — public articles don't require sign-in.
  // userId is passed to getArticle in case future purchase-gating is needed.
  const { userId } = await auth();

  const { article, writer } = await getArticle({
    userId,
    articleId,
    writerId,
  });

  if (!article || !writer) {
    return redirect("/");
  }

  // Clean description for standfirst display
  const standfirst = article.description ? stripHtml(article.description) : null;

  return (
    <article className="flex flex-col max-w-3xl mx-auto pb-24 px-4 md:px-8">

      {/* ── Beat breadcrumb ── */}
      <div className="pt-8 pb-3">
        <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
          {writer.title}
        </p>
      </div>

      {/* ── Headline ── */}
      <h1 className="font-serif text-3xl md:text-4xl font-black text-foreground leading-tight mb-4">
        {article.title}
      </h1>

      {/* ── Standfirst ── */}
      {standfirst && (
        <p className="font-serif text-lg italic text-muted-foreground leading-relaxed mb-6 border-l-2 border-foreground pl-4">
          {standfirst}
        </p>
      )}

      {/* ── Separator ── */}
      <div className="border-t-2 border-foreground mb-8" />

      {/* ── Cover image ── */}
      {article.imageUrl && (
        <div className="relative aspect-video w-full mb-8 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title ?? "Article cover image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          {/* Caption placeholder — add article.imageCaption field when ready */}
        </div>
      )}

      {/* ── Body copy ── */}
      {/*
        article.description is rendered here as body content.
        Replace with article.body (a dedicated rich-text field) once the
        body editor is wired up. For now the description doubles as body.

        dangerouslySetInnerHTML is intentional for rich-text body content,
        BUT only after sanitisation. In production, sanitise server-side
        with `sanitize-html` before passing to the client:

          import sanitizeHtml from "sanitize-html";
          const safeBody = sanitizeHtml(article.description);
      */}
      {article.description && (
        <div
          className="prose prose-lg prose-serif max-w-none
            prose-headings:font-serif prose-headings:font-bold
            prose-p:leading-relaxed prose-p:text-foreground
            prose-a:text-foreground prose-a:underline
            prose-blockquote:border-l-2 prose-blockquote:border-foreground
            prose-blockquote:font-serif prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: article.description }}
        />
      )}

    </article>
  );
};

export default ArticleIdPage;
