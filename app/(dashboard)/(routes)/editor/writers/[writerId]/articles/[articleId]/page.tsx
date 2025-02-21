import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Image } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArticleTitleForm } from "./_components/article-title-form";
import { ArticleDescriptionForm } from "./_components/article-description-form";
import { ArticleImageForm } from "./_components/article-image-form";
import { Banner } from "@/components/banner";
import { ArticleActions } from "./_components/article-actions";

const ArticleIdPage = async ({
  params,
}: {
  params: Promise<{ writerId: string; articleId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const article = await db.article.findUnique({
    where: {
      id: (await params).articleId,
      writerId: (await params).writerId,
    },
  });
  if (!article) {
    return redirect("/");
  }
  const requiredFields = [article.title, article.description, article.imageUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!article?.isPublished && (
        <Banner
          variant="warning"
          label="This article is unpublished. It will not be visible in the topic."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/editor/editor/writers/${(await params).writerId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to topic setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Article creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ArticleActions
                disabled={!isComplete}
                writerId={(await params).writerId}
                articleId={(await params).articleId}
                isPublished={article.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your article</h2>
              </div>
              <ArticleTitleForm
                initialData={article}
                writer={(await params).writerId}
                articleId={(await params).articleId}
              />
              <ArticleDescriptionForm
                initialData={article}
                writerId={(await params).writerId}
                articleId={(await params).articleId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Image} />
              <h2 className="text-xl">Add an article image</h2>
            </div>
            <ArticleImageForm
              initialData={article}
              writerId={(await params).writerId}
              articleId={(await params).articleId}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ArticleIdPage;
