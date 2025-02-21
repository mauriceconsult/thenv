import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ writerId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const writer = await db.writer.findUnique({
      where: {
        id: (await params).writerId,
        userId,
        },
        include: {
          articles: true,
      }  
    });
    if (!writer) {
      return new NextResponse("Not found", { status: 404 });
    }
    const hasPublishedArticle = writer.articles.some(
      (article) => article.isPublished
    );
    if (
      !writer.title ||
      !writer.description ||
      !writer.imageUrl ||
      !writer.categoryId ||
      !hasPublishedArticle
    ) {
      return new NextResponse("Missing required fields", { status: 401 });
    }
    const publishedTopic = await db.writer.update({
      where: {
        id: (await params).writerId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedTopic);
  } catch (error) {
    console.log("[TOPIC_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
