"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink, PenLine } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { Suspense } from "react";

// ─── Platform switcher ────────────────────────────────────────────────────────

const PLATFORM_APPS = [
  { label: "Maxnovate",  href: "/",                            external: false, available: true },
  { label: "InstaSkul",  href: "https://instaskul.com",        external: true,  available: true },
  { label: "Studio AI",  href: "https://studio.maxnovate.com", external: true,  available: true },
  { label: "Vendly",     href: "https://vendly.com",           external: true,  available: true },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isEditorPage = pathname.startsWith("/editor");
  const isNewsPage   = pathname.startsWith("/news") || pathname.startsWith("/search");
  const isHomePage   = pathname === "/";
  const showSearch   = isNewsPage || isHomePage;

  return (
    <div className="flex items-center justify-between w-full gap-x-4">

      {/* Search — shown on home and news/search pages */}
      <div className={showSearch ? "flex-1 max-w-md hidden md:block" : "flex-1"}>
        {showSearch && (
          <Suspense fallback={
            <div className="h-9 bg-muted/40 animate-pulse rounded-none" />
          }>
            <SearchInput />
          </Suspense>
        )}
      </div>

      {/* Platform switcher — hidden inside editor */}
      {!isEditorPage && (
        <nav className="hidden lg:flex items-center gap-x-1">
          {PLATFORM_APPS.map((app) =>
            app.available ? (
              <Link
                key={app.label}
                href={app.href}
                target={app.external ? "_blank" : undefined}
                rel={app.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {app.label}
                {app.external && <ExternalLink className="h-2.5 w-2.5 opacity-40" />}
              </Link>
            ) : (
              <span
                key={app.label}
                className="px-3 py-1.5 text-xs font-mono tracking-widest uppercase text-muted-foreground/40 cursor-not-allowed"
                title="Coming soon"
              >
                {app.label}
              </span>
            )
          )}
        </nav>
      )}

      {/* Right-hand actions */}
      <div className="flex items-center gap-x-2 ml-auto flex-shrink-0">

        {isEditorPage ? (
          // Inside editor — show exit button
          <Link href="/">
            <Button size="sm" variant="ghost"
              className="font-mono text-[9px] tracking-widest uppercase">
              <LogOut className="h-3 w-3 mr-1.5" />
              Exit editor
            </Button>
          </Link>
        ) : userId ? (
          // Any signed-in user — show write button
          <Link href="/editor/writers">
            <Button size="sm" variant="ghost"
              className="font-mono text-[9px] tracking-widest uppercase">
              <PenLine className="h-3 w-3 mr-1.5" />
              New post
            </Button>
          </Link>
        ) : null}

        {userId && <UserButton afterSwitchSessionUrl="/" />}
      </div>
    </div>
  );
};
