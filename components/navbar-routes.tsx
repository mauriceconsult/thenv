"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isEditor } from "@/lib/editor";
import { Suspense } from "react";

// ─── Platform switcher ────────────────────────────────────────────────────────
// Each entry maps to an app in the platform suite.
// Set href to the deployed origin or an internal route as each app comes online.

// const PLATFORM_APPS = [
//   { label: "The Editorial", href: "/",           active: true  },
//   { label: "EdTech",        href: "/edtech",      active: false },
//   { label: "Commerce",      href: "/commerce",    active: false },
//   { label: "Studio AI",     href: "/studio",      active: false },
// ] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  // Use startsWith for all section checks — avoids partial-match bugs
  const isEditorPage  = pathname.startsWith("/editor");
  const isSearchPage  = pathname === "/search";
  const isHomePage    = pathname === "/";
  const showSearch    = isSearchPage || isHomePage;

  return (
    // Stable outer wrapper — no conditional ml-auto to avoid layout shift
    <div className="flex items-center justify-between w-full gap-x-4">

      {/* Search — centred on home and search pages, hidden elsewhere */}
      <div className={showSearch ? "flex-1 max-w-md hidden md:block" : "flex-1"}>
        {showSearch && (
          <Suspense fallback={
            <div className="h-9 bg-muted/40 animate-pulse rounded-none" />
          }>
            <SearchInput />
          </Suspense>
        )}
      </div>

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
        ) : isEditor(userId) ? (
          // Reader view, user is an editor — show editor mode entry
          <Link href="/editor/writers">
            <Button size="sm" variant="ghost"
              className="font-mono text-[9px] tracking-widest uppercase">
              Editor mode
            </Button>
          </Link>
        ) : null}

        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </div>
  );
};
