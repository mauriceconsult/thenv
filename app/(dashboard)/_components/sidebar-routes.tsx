"use client";

import {
  BarChart,
  BookOpen,
  Compass,
  LayoutDashboard,
  List,
  Sparkles,
  ShoppingBag,
  GraduationCap,
  Building2,
  Phone,
  Info,
  Briefcase,
  Newspaper,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

// ─── Route definitions ────────────────────────────────────────────────────────

// Reader-facing news/blog routes
const readerRoutes = [
  {
    icon: LayoutDashboard,
    label: "Home",
    href: "/",
  },
  {
    icon: Newspaper,
    label: "News & Articles",
    href: "/news",
  },
  {
    icon: Compass,
    label: "Discover",
    href: "/search",
  },
  {
    icon: BookOpen,
    label: "Reading list",
    href: "/reading-list",
  },
];

// Editor/newsroom routes — only shown inside /editor/*
const editorRoutes = [
  {
    icon: List,
    label: "Newsroom",
    href: "/editor",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/editor/analytics",
  },
];

// Maxnovate corporate pages — shown in sidebar for site visitors
const companyRoutes = [
  {
    icon: Info,
    label: "About",
    href: "/about",
  },
  {
    icon: Briefcase,
    label: "Services",
    href: "/services",
  },
  {
    icon: Phone,
    label: "Contact",
    href: "/contact",
  },
];

// Platform suite — external links open in new tab
// Set available: false for platforms not yet live; they render as disabled
const platformRoutes = [
  {
    icon: Building2,
    label: "Maxnovate",
    href: "/",
    external: false,
    available: true,
  },
  {
    icon: GraduationCap,
    label: "InstaSkul",
    href: "https://instaskul.com",
    external: true,
    available: true,
  },
  {
    icon: Sparkles,
    label: "Studio AI",
    href: "https://studio.maxnovate.com",
    external: true,
    available: true,
  },
  {
    icon: ShoppingBag,
    label: "Vendly",
    href: "https://vendly.com",
    external: true,
    available: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isEditorPage = pathname.startsWith("/editor");
  const routes = isEditorPage ? editorRoutes : readerRoutes;

  return (
    <div className="flex flex-col w-full h-full">

      {/* Primary nav — reader or editor */}
      <div className="flex flex-col w-full">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        ))}
      </div>

      {/* Company pages — only in reader view, not inside editor */}
      {!isEditorPage && (
        <div className="mt-6 pt-4 border-t border-border">
          <p className="px-6 pb-2 font-mono text-[8px] tracking-widest uppercase text-muted-foreground">
            Company
          </p>
          {companyRoutes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
            />
          ))}
        </div>
      )}

      {/* Platform switcher — pinned to the bottom */}
      <div className="mt-auto pt-4 border-t border-border">
        <p className="px-6 pb-2 font-mono text-[8px] tracking-widest uppercase text-muted-foreground">
          Platform
        </p>
        {platformRoutes.map((app) => (
          <SidebarItem
            key={app.label}
            icon={app.icon}
            label={app.label}
            href={app.href}
            disabled={!app.available}
            // Pass external flag so SidebarItem can open in new tab if needed.
            // If your SidebarItem doesn't support this prop yet, add it — see note below.
            // @ts-expect-error — add `external?: boolean` prop to SidebarItem when ready
            external={app.external}
          />
        ))}
      </div>

    </div>
  );
};

// ─── SidebarItem external prop note ──────────────────────────────────────────
//
// Your existing SidebarItem likely renders an <a> or Next <Link>.
// Add this to its props interface and conditionally set target/rel:
//
//   interface SidebarItemProps {
//     ...
//     external?: boolean;
//   }
//
//   // In the render:
//   <Link href={href} target={external ? "_blank" : undefined}
//         rel={external ? "noopener noreferrer" : undefined}>
//
