import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const WriterIdPage = async ({
  params,
}: {
  params: Promise<{ writerId: string }>;
}) => {
  const writer = await db.writer.findUnique({
    where: {
      id: (await params).writerId,
    },
    include: {
      articles: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!writer) {
    return redirect("/");
  }
  return redirect(`/writers/${writer.id}/articles/${writer.articles[0].id}`);
};

export default WriterIdPage;
