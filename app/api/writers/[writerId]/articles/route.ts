import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ writerId: string }> }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const writerOwner = db.writer.findUnique({
      where: {
        id: (await params).writerId,
        userId: userId,
      },
    });
    if (!writerOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const lastChapter = await db.article.findFirst({
      where: {
        writerId: (await params).writerId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const article = await db.article.create({
      data: {
        title,
        writerId: (await params).writerId,
        position: newPosition,
        imageUrl: "",
      },
    });
    return NextResponse.json(article);
  } catch (error) {
    console.log("[ARTICLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
