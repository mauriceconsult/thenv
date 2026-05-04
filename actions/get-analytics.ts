// actions/get-analytics.ts
// Returns analytics scoped strictly to the calling user's own writers + articles.
// No user can see another user's data.

import { db } from "@/lib/db";

export interface AnalyticsData {
  // Summary counts
  totalWriters:          number;
  publishedWriters:      number;
  totalArticles:         number;
  publishedArticles:     number;

  // Media format breakdown
  formatBreakdown: {
    Text:    number;
    Video:   number;
    Audio:   number;
    Gallery: number;
    Other:   number;
  };

  // AI usage
  aiImageCount: number;
  aiTextCount:  number;

  // Articles published per month — last 12 months
  // [ { name: "Jan 25", total: 4 }, … ]
  publishedByMonth: { name: string; total: number }[];

  // Articles per writer/beat — for secondary chart
  articlesByWriter: { name: string; total: number; published: number }[];

  // Category distribution (writer-level)
  categoryBreakdown: { name: string; total: number }[];
}

export async function getAnalytics(userId: string): Promise<AnalyticsData> {
  // ── 1. Fetch all writers owned by this user ────────────────────────────────
  const writers = await db.writer.findMany({
    where: { userId },
    include: {
      articles: true,
      category: true,
    },
  });

  const allArticles = writers.flatMap((w) => w.articles);

  // ── 2. Summary counts ──────────────────────────────────────────────────────
  const totalWriters     = writers.length;
  const publishedWriters = writers.filter((w) => w.isPublished).length;
  const totalArticles    = allArticles.length;
  const publishedArticles = allArticles.filter((a) => a.isPublished).length;

  // ── 3. Media format breakdown ──────────────────────────────────────────────
  const formatBreakdown = {
    Text:    0,
    Video:   0,
    Audio:   0,
    Gallery: 0,
    Other:   0,
  };

  for (const article of allArticles) {
    const fmt = article.mediaFormat ?? "Text";
    if (fmt in formatBreakdown) {
      formatBreakdown[fmt as keyof typeof formatBreakdown]++;
    } else {
      formatBreakdown.Other++;
    }
  }

  // ── 4. AI usage ────────────────────────────────────────────────────────────
  const aiImageCount = allArticles.filter((a) => !!a.aiImageGenId).length;
  const aiTextCount  = allArticles.filter((a) => !!a.aiTextGenId).length;

  // ── 5. Published articles by month (last 12 months) ───────────────────────
  const now    = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return {
      key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      name:  d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
      total: 0,
    };
  });

  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  for (const article of allArticles) {
    if (!article.isPublished) continue;
    if (article.updatedAt < twelveMonthsAgo) continue;
    const key = `${article.updatedAt.getFullYear()}-${String(article.updatedAt.getMonth() + 1).padStart(2, "0")}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.total++;
  }

  const publishedByMonth = months.map(({ name, total }) => ({ name, total }));

  // ── 6. Articles per writer ─────────────────────────────────────────────────
  const articlesByWriter = writers
    .map((w) => ({
      name:      w.title.length > 28 ? w.title.slice(0, 26) + "…" : w.title,
      total:     w.articles.length,
      published: w.articles.filter((a) => a.isPublished).length,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8); // top 8 beats

  // ── 7. Category distribution ───────────────────────────────────────────────
  const categoryMap = new Map<string, number>();
  for (const writer of writers) {
    const catName = writer.category?.name ?? "Uncategorised";
    categoryMap.set(catName, (categoryMap.get(catName) ?? 0) + 1);
  }
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  return {
    totalWriters,
    publishedWriters,
    totalArticles,
    publishedArticles,
    formatBreakdown,
    aiImageCount,
    aiTextCount,
    publishedByMonth,
    articlesByWriter,
    categoryBreakdown,
  };
}
