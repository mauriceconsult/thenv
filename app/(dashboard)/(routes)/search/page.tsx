import { db } from "@/lib/db";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { getTopics } from "@/actions/get-topics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TopicsList } from "@/components/topics-list";

interface SearchPageProps {
  searchParams: Promise<{
    title: string;
    categoryId: string;
  }>;
}
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const topics = await getTopics({
      userId,     
    ...await searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <TopicsList items={topics} />
      </div>
    </>
  );
};
export default SearchPage;
