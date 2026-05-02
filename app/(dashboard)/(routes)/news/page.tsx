// app/(main)/news/page.tsx
//
// This is the old root page, relocated to /news.
// Auth is still required here — readers must sign in to access the feed.
// The public homepage (/) no longer requires auth.

import { db } from "@/lib/db";
import { Categories } from "@/app/(dashboard)/(routes)/search/_components/categories";
import { SearchInput } from "@/components/search-input";
import { getTopics } from "@/actions/get-topics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TopicsList } from "@/components/topics-list";
import { Newspaper } from "lucide-react";

const NewsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    // Send unauthenticated visitors to sign-in, then back to /news
    return redirect("/sign-in?redirect_url=/news");
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const topics = await getTopics({ userId });

  return (
    <>
      {/* Mobile search — shown only on small screens where the navbar search is hidden */}
      <div className="px-6 pt-6 md:hidden block">
        <SearchInput />
      </div>

      {/* Page header — gives the /news route its own identity */}
      <div className="px-6 pt-6 pb-2 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Newspaper className="h-4 w-4 text-muted-foreground" />
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            News & articles
          </p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">The Editorial</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Business news, analysis, and insights from the Maxnovate network.
        </p>
      </div>

      {/* Feed — identical to the old root page content */}
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <TopicsList items={topics} />
      </div>
    </>
  );
};

export default NewsPage;
