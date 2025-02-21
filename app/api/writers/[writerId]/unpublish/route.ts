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
    });
    if (!writer) {
      return new NextResponse("Not found", { status: 404 });
    }
    const unpublishedTopic = await db.writer.update({
      where: {
        id: (await params).writerId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    return NextResponse.json(unpublishedTopic);
  } catch (error) {
    console.log("[TOPIC_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
