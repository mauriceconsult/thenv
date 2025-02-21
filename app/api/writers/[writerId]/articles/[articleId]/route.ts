import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ writerId: string; articleId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const writerOwner = await db.writer.findUnique({
      where: {
        id: (await params).writerId,
        userId,
      },
    });
    if (!writerOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // const article = await db.article.findUnique({
    //   where: {
    //     id: (await params).writerId,
    //     writerId: (await params).writerId,
    //   },
    // });
    // if (!article) {
    //   return new NextResponse("Not found", { status: 404 });
    // }
    const deletedArticle = await db.article.delete({
      where: {
        id: (await params).articleId,
      },
    });
    const publishedArticlesInTopic = await db.article.findMany({
      where: {
        writerId: (await params).writerId,
        isPublished: true,
      },
    });
    if (!publishedArticlesInTopic.length) {
      await db.writer.update({
        where: {
          id: (await params).writerId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(deletedArticle);
  } catch (error) {
    console.log("[ARTICLE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ writerId: string; articleId: string }> }
) {
  try {
    const { userId } = await auth();
    const { ...values } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const writerOwner = await db.writer.findUnique({
      where: {
        id: (await params).writerId,
        userId,
      },
    });
    if (!writerOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const article = await db.article.update({
      where: {
        id: (await params).articleId,
        writerId: (await params).writerId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.log("[TOPIC_ARTICLE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
