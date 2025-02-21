import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";

interface TopicCardProps {
  id: string;
  title: string;
  imageUrl: string;
  articlesLength: number;
  category: string;
}
export const TopicCard = ({
  id,
  title,
  imageUrl,
  articlesLength,
  category,
}: TopicCardProps) => {
  return (
    <Link href={`/writers/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md">
          <Image fill className="object-cover" alt="title" src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {articlesLength} {articlesLength === 1 ? "Article" : "Articles"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
