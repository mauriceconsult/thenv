import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ writerId: string; articleId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownTopic = await db.writer.findUnique({
      where: {
        id: (await params).writerId,
        userId,
      },
    });
    if (!ownTopic) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedArticle = await db.article.update({
      where: {
        id: (await params).articleId,
        writerId: (await params).writerId,
      },
      data: {
        isPublished: false,
      },
    });
    const publishedArticlesInTopic = await db.article.findMany({
      where: {
        writerId: (await params).writerId,
        isPublished: true,
      },
    });
    if (!publishedArticlesInTopic) {
      await db.writer.update({
        where: {
          id: (await params).writerId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unpublishedArticle);
  } catch (error) {
    console.log("[ARTICLE_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
