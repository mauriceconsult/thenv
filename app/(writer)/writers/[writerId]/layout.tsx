import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import WriterSidebar from "./_components/writer-sidebar";
import { WriterNavbar } from "./_components/writer-navbar";

/**
 * WriterLayout — PUBLIC layout for the reader-facing beat view.
 *
 * Key decisions:
 * - No auth() requirement. Published beats and articles are public content.
 *   Individual article pages can still check auth for purchase-gated content
 *   if needed — but the layout must not block unauthenticated readers.
 * - Writer is fetched here so the sidebar and navbar have the full article list
 *   without each child page re-fetching it.
 * - Only published articles are included — draft articles are never surfaced
 *   to readers regardless of how the URL is constructed.
 */

const WriterLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ writerId: string }>;
}) => {
  const { writerId } = await params;

  const writer = await db.writer.findUnique({
    where: {
      id: writerId,
      // Only surface beats that are themselves published
      isPublished: true,
    },
    include: {
      articles: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
  });

  // Beat doesn't exist or isn't published → 404-style redirect
  if (!writer) {
    redirect("/");
  }

  return (
    <div className="h-full">
      {/* Top navbar — fixed, full width on mobile, offset on desktop */}
      <div className="h-[80px] md:pl-80 fixed inset-x-0 top-0 z-50">
        <WriterNavbar writer={writer} />
      </div>

      {/* Article list sidebar — desktop only */}
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 left-0 z-40">
        <WriterSidebar writer={writer} />
      </div>

      {/* Page content */}
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default WriterLayout;
