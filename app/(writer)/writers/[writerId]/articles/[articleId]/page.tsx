import { getArticle } from "@/actions/get-article";
import { ArticleImageForm } from "@/app/(dashboard)/(routes)/editor/writers/[writerId]/articles/[articleId]/_components/article-image-form";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ArticleIdPage = async ({
    params
}: { params: Promise<{ writerId: string; articleId: string }> }) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }
    const { article, writer } = await getArticle({
        userId,
        articleId: (await params).articleId,
        writerId: (await params).writerId
        
    });
    if (!article || !writer) {
        return redirect("/");
    }

    return (
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <ArticleImageForm
            initialData={article}
            writerId={(await params).writerId}
            articleId={(await params).articleId}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {article.title}
            </h2>
          </div>
          <Separator />
          <div>
            <Preview value={article.description!
              
            }/>
          </div>
        </div>
      </div>
    );
}
 
export default ArticleIdPage;