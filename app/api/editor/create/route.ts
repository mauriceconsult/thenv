import { db } from "@/lib/db";
import { isEditor } from "@/lib/editor";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId || !isEditor(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const writer = await db.writer.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(writer);
  } catch (error) {
    console.log("[CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
