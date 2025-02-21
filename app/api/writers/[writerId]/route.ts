import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
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
        userId: userId,
      },
    });
    if (!writer) {
      return new NextResponse("Not found", { status: 404 });
    }
    const deletedTopic = await db.writer.delete({
      where: {
        id: (await params).writerId,
      },
    });
    return NextResponse.json(deletedTopic);
  } catch (error) {
    console.log("[TOPIC_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ writerId: string }> }
) {
  try {
    const { userId } = await auth();
    const { writerId } = await params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const writer = await db.writer.update({
      where: {
        id: writerId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(writer);
  } catch (error) {
    console.log("[WRITER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
