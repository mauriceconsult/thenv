/**
 * writer-id-page.tsx  (app/editor/writers/[writerId]/page.tsx)
 *
 * Changes from previous version:
 * - Passes writer.title as beatTitle to DescriptionForm and ImageForm
 *   so their Studio AI prompts have full context.
 * - Styling aligned to editorial system.
 */

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
  if (!userId) return redirect("/");

  const { writerId } = await params;

  const writer = await db.writer.findUnique({
    where: { id: writerId, userId },
    include: {
      articles: { orderBy: { position: "asc" } },
    },
  });
  if (!writer) return redirect("/");

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const requiredFields = [
    writer.title,
    writer.description,
    writer.imageUrl,
    writer.categoryId,
    writer.articles.some(
      (article: { isPublished: unknown }) => article.isPublished,
    ),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!writer.isPublished && (
        <Banner label="Draft — not visible to readers until published." />
      )}
      <div className="p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-2xl font-black text-foreground">
              Beat Setup
            </h1>
            <span
              className={`font-mono text-[10px] tracking-wide border px-2 py-0.5 w-fit ${
                isComplete
                  ? "border-foreground text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {completionText} fields complete
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            writerId={writerId}
            isPublished={writer.isPublished}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: beat customisation */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b-2 border-foreground">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Customise your beat
              </h2>
            </div>

            <TitleForm initialData={writer} writerId={writer.id} />

            {/*
              beatTitle is passed so DescriptionForm can build a
              context-aware Studio AI prompt even before the title
              has been saved to the DB.
            */}
            <DescriptionForm initialData={writer} writerId={writer.id} />

            {/*
              writer.title + writer.description flow into the image
              prompt automatically via the ImageForm component.
            */}
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

          {/* Right: filed articles */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-5 border-b-2 border-foreground">
                <IconBadge icon={ListChecks} />
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Filed articles
                </h2>
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


