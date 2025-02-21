import { Category, Writer } from "@prisma/client";
import { TopicCard } from "./topic-card";

type TopicsWithCategory = Writer & {
  category: Category | null;
  articles: { id: string }[];  
};

interface TopicsListProps {
  items: TopicsWithCategory[];
}
export const TopicsList = ({ items }: TopicsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <TopicCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            articlesLength={item.articles.length}
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No topics found
        </div>
      )}
    </div>
  );
};
