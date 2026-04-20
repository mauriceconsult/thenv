"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Article, Writer } from "@prisma/client";
import { ArticlesList } from "./articles-list";

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaFormat =
  | "Text"
  | "Video"
  | "Podcast"
  | "Gallery"
  | "Infographic"
  | "Interview";

const FORMATS: MediaFormat[] = [
  "Text",
  "Video",
  "Podcast",
  "Gallery",
  "Infographic",
  "Interview",
];

const FORMAT_COLORS: Record<MediaFormat, string> = {
  Text: "bg-emerald-600",
  Video: "bg-blue-600",
  Podcast: "bg-purple-600",
  Gallery: "bg-amber-600",
  Infographic: "bg-rose-600",
  Interview: "bg-teal-600",
};

interface ArticlesFormProps {
  initialData: Writer & { articles: Article[] };
  writerId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

// ─── Component ────────────────────────────────────────────────────────────────

export const ArticlesForm = ({ initialData, writerId }: ArticlesFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<MediaFormat>("Text");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<"order" | "published" | "alpha">(
    "order",
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });
  const { isSubmitting, isValid } = form.formState;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const toggleCreating = () => {
    setIsCreating((c) => !c);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/writers/${writerId}/articles`, {
        ...values,
        mediaFormat: selectedFormat,
      });
      toast.success("Article filed.");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/writers/${writerId}/articles/reorder`, {
        list: updateData,
      });
      toast.success("Articles reordered.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/editor/writers/${writerId}/articles/${id}`);
  };

  // ── Derived state ─────────────────────────────────────────────────────────

  const articles = initialData.articles;
  const publishedCount = articles.filter((a) => a.isPublished).length;

  const filtered = useMemo(() => {
    let list = [...articles];
    if (searchQuery)
      list = list.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    if (sortMode === "published")
      list.sort((a, b) => Number(b.isPublished) - Number(a.isPublished));
    else if (sortMode === "alpha")
      list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [articles, searchQuery, sortMode]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative mt-6 border border-border bg-background">
      {/* Reorder overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-background/60 z-10 flex items-center justify-center">
          <Loader2 className="animate-spin h-5 w-5 text-foreground" />
        </div>
      )}

      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          Filed articles
        </span>
        <button
          onClick={toggleCreating}
          className={cn(
            "font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 transition-opacity",
            isCreating
              ? "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              : "bg-foreground text-background hover:opacity-80",
          )}
        >
          {isCreating ? "✕ Cancel" : "+ File new article"}
        </button>
      </div>

      {/* New article form */}
      {isCreating && (
        <div className="px-4 py-4 border-b border-border bg-muted/30">
          {/* Format pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={cn(
                  "font-mono text-[8px] tracking-widest uppercase px-2.5 py-1 border transition-all",
                  selectedFormat === fmt
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
              >
                {fmt}
              </button>
            ))}
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-start gap-3"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Article headline…"
                        className="border-0 border-b border-foreground rounded-none bg-transparent font-serif text-base placeholder:italic placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="font-mono text-[9px] tracking-widest uppercase rounded-none h-9"
              >
                File →
              </Button>
            </form>
          </Form>

          <p className="mt-3 font-mono text-[9px] text-muted-foreground tracking-wide">
            Format selected:{" "}
            <span className="text-foreground">{selectedFormat}</span> · You can
            change this in the article editor.
          </p>
        </div>
      )}

      {/* Toolbar: search + sort + view toggle */}
      {!isCreating && (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="5" cy="5" r="3.5" />
              <path d="M8 8l2.5 2.5" />
            </svg>
            <input
              type="text"
              placeholder="Search articles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 border border-border bg-transparent font-mono text-[10px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground"
            />
          </div>

          {/* Sort */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
            className="font-mono text-[9px] uppercase tracking-wide border border-border bg-transparent text-muted-foreground px-2 py-1.5 outline-none cursor-pointer hover:border-foreground hover:text-foreground"
          >
            <option value="order">Order</option>
            <option value="published">Published first</option>
            <option value="alpha">A–Z</option>
          </select>

          {/* View toggle */}
          <div className="flex border border-border">
            <button
              onClick={() => setViewMode("list")}
              title="List view"
              className={cn(
                "w-7 h-7 flex items-center justify-center transition",
                viewMode === "list"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                <rect x="1" y="1" width="10" height="2" />
                <rect x="1" y="5" width="10" height="2" />
                <rect x="1" y="9" width="10" height="2" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Grid view"
              className={cn(
                "w-7 h-7 flex items-center justify-center transition",
                viewMode === "grid"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                <rect x="1" y="1" width="4" height="4" />
                <rect x="7" y="1" width="4" height="4" />
                <rect x="1" y="7" width="4" height="4" />
                <rect x="7" y="7" width="4" height="4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Article list / grid */}
      {!isCreating && (
        <>
          {!filtered.length ? (
            <div className="py-10 text-center">
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                {searchQuery ? "No articles match" : "No articles yet"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            // Grid view
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((article) => {
                const fmt = (article as Article & { mediaFormat?: MediaFormat })
                  .mediaFormat as MediaFormat | undefined;
                return (
                  <button
                    key={article.id}
                    onClick={() => onEdit(article.id)}
                    className="text-left border border-border p-3 hover:bg-muted/40 transition group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {fmt && (
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            FORMAT_COLORS[fmt] ?? "bg-gray-400",
                          )}
                        />
                      )}
                      <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">
                        {fmt ?? "Text"}
                      </span>
                      <span
                        className={cn(
                          "ml-auto font-mono text-[8px] uppercase tracking-widest",
                          article.isPublished
                            ? "text-emerald-700"
                            : "text-muted-foreground",
                        )}
                      >
                        {article.isPublished ? "Live" : "Draft"}
                      </span>
                    </div>
                    <p className="font-serif text-xs text-foreground leading-snug line-clamp-3">
                      {article.title}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            // List view (existing drag-reorder component)
            <ArticlesList
              onEdit={onEdit}
              onReorder={onReorder}
              items={filtered}
            />
          )}
        </>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border">
        <span className="font-mono text-[9px] text-muted-foreground tracking-wide">
          {articles.length} article{articles.length !== 1 ? "s" : ""} ·{" "}
          {publishedCount} published
        </span>
        {!isCreating && viewMode === "list" && (
          <span className="font-mono text-[9px] text-muted-foreground tracking-wide">
            Drag to reorder
          </span>
        )}
      </div>
    </div>
  );
};
