// app/(dashboard)/(routes)/editor/analytics/page.tsx
// Scoped to the signed-in user — each user sees only their own stats.

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAnalytics } from "@/actions/get-analytics";
import { DataCard } from "./_components/data-card";
import { TimeChart, FormatBreakdown, WriterChart } from "./_components/chart";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const analytics = await getAnalytics(userId).catch(() => null);

  if (!analytics) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          Could not load analytics — please try again.
        </p>
      </div>
    );
  }

  const {
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
  } = analytics;

  // Derive publish rate for display
  const publishRate = totalArticles > 0
    ? Math.round((publishedArticles / totalArticles) * 100)
    : 0;

  // Format breakdown as sorted array for the chart
  const formatData = Object.entries(formatBreakdown)
    .map(([name, total]) => ({ name, total }))
    .filter((d) => d.total > 0)
    .sort((a, b) => b.total - a.total);

  // Check if there's any data at all
  const isEmpty = totalWriters === 0 && totalArticles === 0;

  return (
    <div className="p-6 max-w-6xl space-y-8">

      {/* ── Header ── */}
      <div className="border-b border-border pb-5">
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
          Your editorial analytics
        </p>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Analytics
        </h1>
      </div>

      {isEmpty ? (
        <div className="border border-dashed border-border rounded-none p-12 text-center">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2">
            No data yet
          </p>
          <p className="text-sm text-muted-foreground">
            Create your first beat and publish some articles to see analytics here.
          </p>
        </div>
      ) : (
        <>
          {/* ── Summary cards ── */}
          <div>
            <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
              Overview
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
              <DataCard
                label="Total beats"
                value={totalWriters}
                sub={`${publishedWriters} published`}
              />
              <DataCard
                label="Total articles"
                value={totalArticles}
                sub={`${publishedArticles} published`}
              />
              <DataCard
                label="Publish rate"
                value={publishRate}
                format="percent"
                sub="of all articles"
                accent
              />
              <DataCard
                label="AI assisted"
                value={aiImageCount + aiTextCount}
                sub={`${aiImageCount} image · ${aiTextCount} text`}
              />
            </div>
          </div>

          {/* ── Main chart: published over time ── */}
          <div className="border border-border bg-background">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground">
                Articles published — last 12 months
              </p>
              <p className="font-mono text-[9px] text-muted-foreground">
                {publishedArticles} total
              </p>
            </div>
            <div className="p-5">
              <TimeChart data={publishedByMonth} />
            </div>
          </div>

          {/* ── Two-column lower section ── */}
          <div className="grid md:grid-cols-2 gap-px bg-border">

            {/* Media format breakdown */}
            <div className="bg-background border border-border p-5">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground mb-5">
                Media format breakdown
              </p>
              {formatData.length > 0 ? (
                <FormatBreakdown data={formatData} />
              ) : (
                <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">
                  No articles yet
                </p>
              )}
            </div>

            {/* Articles per beat */}
            <div className="bg-background border border-border p-5">
              <div className="flex items-center justify-between mb-5">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground">
                  Articles per beat
                </p>
                <p className="font-mono text-[9px] text-muted-foreground">
                  Top {Math.min(articlesByWriter.length, 8)}
                </p>
              </div>
              <WriterChart data={articlesByWriter} />
            </div>
          </div>

          {/* ── Category distribution ── */}
          {categoryBreakdown.length > 0 && (
            <div className="border border-border bg-background">
              <div className="px-5 py-3.5 border-b border-border">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground">
                  Beats by category
                </p>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {categoryBreakdown.map(({ name, total }) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 border border-border px-3 py-1.5"
                    >
                      <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
                        {name}
                      </span>
                      <span className="font-serif text-sm font-bold text-foreground">
                        {total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── AI usage detail ── */}
          {(aiImageCount + aiTextCount) > 0 && (
            <div className="border border-border bg-background">
              <div className="px-5 py-3.5 border-b border-border">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground">
                  Studio AI usage
                </p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border">
                <div className="bg-background p-5">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-2">
                    AI image generations
                  </p>
                  <p className="font-serif text-3xl font-bold text-foreground">
                    {aiImageCount}
                  </p>
                </div>
                <div className="bg-background p-5">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-2">
                    AI text generations
                  </p>
                  <p className="font-serif text-3xl font-bold text-foreground">
                    {aiTextCount}
                  </p>
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}
