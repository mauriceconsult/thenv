import { db } from "@/lib/db";

interface GetArticleProps {
  articleId: string;
  writerId: string;
  /**
   * Optional — pass when the article may have purchase-gated content.
   * If null/undefined the article is treated as fully public.
   */
  userId?: string | null;
}

/**
 * getArticle — server action for the public article reader.
 *
 * Rules:
 * - The beat must be published.
 * - The article must be published.
 * - userId is optional — public articles need no authentication.
 * - Returns null for both article and writer when any guard fails,
 *   so the calling page can redirect cleanly without a try/catch.
 */
export const getArticle = async ({
  articleId,
  writerId,
  userId,
}: GetArticleProps) => {
  try {
    const writer = await db.writer.findUnique({
      where: {
        id: writerId,
        isPublished: true,
        userId: userId || undefined, // only apply userId filter if it's provided
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        categoryId: true,
      },
    });

    if (!writer) return { article: null, writer: null };

    const article = await db.article.findUnique({
      where: {
        id: articleId,
        writerId,
        isPublished: true, // never surface unpublished articles to readers
      },
    });

    if (!article) return { article: null, writer: null };

    return { article, writer };
  } catch (error) {
    console.error("[GET_ARTICLE]", error);
    return { article: null, writer: null };
  }
};
