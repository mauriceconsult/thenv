"use client";

import { Article } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArticlesListProps {
  items: Article[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ArticlesList = ({
  items,
  onReorder,
  onEdit,
}: ArticlesListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [articles, setArticles] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setArticles(items);
  }, [items]);
      
      const onDragEnd = (result: DropResult) => {
          if (!result.destination) return;

          const items = Array.from(articles);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);

          const startIndex = Math.min(result.source.index, result.destination.index);
          const endIndex = Math.max(result.source.index, result.destination.index);

          const updatedArticles = items.slice(startIndex, endIndex + 1);

          setArticles(items);

          const bulkUpdateData = updatedArticles.map((article) => ({
              id: article.id,
              position: items.findIndex((item) => item.id === article.id)
          }));
        
          onReorder(bulkUpdateData);
      }  
  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="articles">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {articles.map((article, index) => (
              <Draggable
                key={article.id}
                draggableId={article.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      article.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        article.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {article.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          article.isPublished && "bg-sky-700"
                        )}
                      >
                        {article.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(article.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
