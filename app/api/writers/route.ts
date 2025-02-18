import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId) {
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
    console.log("{WRITERS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
