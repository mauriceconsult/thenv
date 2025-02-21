import { auth } from "@clerk/nextjs/server";
import { Article, Writer } from "@prisma/client";
import { redirect } from "next/navigation";
import WriterSidebarItem from "./writer-sidebar-item";

interface WriterSidebarProps {
  writer: Writer & {
    articles: Article[];
  };
}

const WriterSidebar = async ({ writer }: WriterSidebarProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">{writer.title}</h1>
            </div>
            <div className="flex flex-col w-full">
                {writer.articles.map((article) => (
                    <WriterSidebarItem key={article.id} id={article.id} label={article.title} writerId={writer.id} />
                ))}

            </div>
      </div>
    );
};

export default WriterSidebar;
