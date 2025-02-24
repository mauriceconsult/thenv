import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { ArticlesForm } from "./_components/articles-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";

const WriterIdPage = async ({
  params,
}: {
  params: Promise<{ writerId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const writer = await db.writer.findUnique({
    where: {
      id: (await params).writerId,
      userId,
    },
    include: {
      articles: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!writer) {
    return redirect("/");
  }
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  // console.log(categories);
  if (!writer) {
    return redirect("/");
  }
  const requiredFields = [
    writer.title,
    writer.description,
    writer.imageUrl,
    writer.categoryId,
    writer.articles.some(
      (article: { isPublished: unknown }) => article.isPublished
    ),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!writer.isPublished && (
        <Banner label="This topic is unpublished. It will not be visible to the readers."/>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Topic setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions disabled={!isComplete} writerId={(await params).writerId } isPublished={writer.isPublished} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-2xl">Customize your topic</h2>
            </div>
            <TitleForm initialData={writer} writerId={writer.id} />
            <DescriptionForm initialData={writer} writerId={writer.id} />
            <ImageForm initialData={writer} writerId={writer.id} />
            <CategoryForm
              initialData={writer}
              writerId={writer.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Topic articles</h2>
              </div>
              <ArticlesForm initialData={writer} writerId={writer.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WriterIdPage;
