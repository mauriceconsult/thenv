import { db } from "@/lib/db";

interface GetArticleProps {
  userId: string;
  writerId: string;
  articleId: string;
}
export const getArticle = async ({ writerId, articleId }: GetArticleProps) => {
  try {
    const writer = await db.writer.findUnique({
      where: {
        isPublished: true,
        id: writerId,
      },
    });
    const article = await db.article.findUnique({
      where: {
        id: articleId,
        isPublished: true,
      },
    });
    if (!article || !writer) {
      throw new Error("Article or topic unavailable");
    }
    return {
      article,
      writer,    
    };
  } catch (error) {
    console.log("[GET_ARTICLE]", error);
    return {
      article: null,
      writer: null,
      imageUrl: null,     
    };
  }
};
