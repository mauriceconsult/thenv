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
    const article = await db.article.findUnique({
      where: {
        id: (await params).articleId,
        writerId: (await params).writerId,
      },
    }); 
    if (
      !article ||      
      !article.title ||
      !article.description
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    const publishedChapter = await db.article.update({
      where: {
        id: (await params).articleId,
        writerId: (await params).writerId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[ARTICLE_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
