import { db } from "@/lib/db";
import { redirect } from "next/navigation";

/**
 * WriterIdPage — /writers/[writerId]
 *
 * Acts as a redirect hub to the first published article.
 * Does NOT require auth — the beat is public.
 *
 * Guards:
 * - Writer not found or unpublished → /
 * - Writer has no published articles → dedicated empty state page
 *   rather than crashing on articles[0]
 */

const WriterIdPage = async ({
  params,
}: {
  params: Promise<{ writerId: string }>;
}) => {
  const { writerId } = await params;

  const writer = await db.writer.findUnique({
    where: {
      id: writerId,
      isPublished: true,
    },
    include: {
      articles: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
        // Only need the id for the redirect
        select: { id: true },
      },
    },
  });

  if (!writer) {
    return redirect("/");
  }

  // Guard: no published articles yet
  if (writer.articles.length === 0) {
    // Redirect to the beat's "coming soon" page rather than crashing
    return redirect(`/writers/${writerId}/coming-soon`);
  }

  return redirect(`/writers/${writerId}/articles/${writer.articles[0].id}`);
};

export default WriterIdPage;
