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
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

// ─── Route definitions ────────────────────────────────────────────────────────

const readerRoutes = [
  {
    icon: LayoutDashboard,
    label: "Home",
    href: "/",
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

// Platform switcher entries — shown at the bottom of the sidebar
// Mark active:false for apps not yet deployed; they render as disabled
const platformRoutes = [
  {
    icon: BookOpen,
    label: "The Editorial",
    href: "/",
    available: true,
  },
  {
    icon: GraduationCap,
    label: "EdTech",
    href: "/edtech",
    available: false,
  },
  {
    icon: ShoppingBag,
    label: "Commerce",
    href: "/commerce",
    available: false,
  },
  {
    icon: Sparkles,
    label: "Studio AI",
    href: "/studio",
    available: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const SidebarRoutes = () => {
  const pathname = usePathname();

  // Use startsWith("/editor") — not includes() — to avoid false positives
  // on future routes like /reader/editor-picks or /admin/editors
  const isEditorPage = pathname.startsWith("/editor");
  const routes = isEditorPage ? editorRoutes : readerRoutes;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Primary nav routes */}
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

      {/* Platform switcher — pinned to the bottom */}
      <div className="mt-auto pt-4 border-t border-border">
        <p className="px-6 pb-2 font-mono text-[8px] tracking-widest uppercase text-muted-foreground">
          Platform
        </p>
        {platformRoutes.map((app) => (
          <SidebarItem
            key={app.href}
            icon={app.icon}
            label={app.label}
            href={app.href}
            disabled={!app.available}
          />
        ))}
      </div>
    </div>
  );
};
