import { Category, Writer } from "@prisma/client";
import { db } from "@/lib/db";

type TopicWithCategory = Writer & {
  category: Category | null;
  articles: { id: string }[];
};
type GetTopics = {
  userId: string;
  title?: string;
  categoryId?: string;
};
export const getTopics = async ({
  title,
  categoryId,
}: GetTopics): Promise<TopicWithCategory[]> => {
  try {
    const topics = await db.writer.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        articles: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return topics;
  } catch (error) {
    console.log("[GET_TOPICS]", error);
    return [];
  }
};
