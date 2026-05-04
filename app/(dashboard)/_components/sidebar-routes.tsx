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

const readerRoutes = [
  { icon: LayoutDashboard, label: "Home",            href: "/"             },
  { icon: Newspaper,       label: "News & Articles", href: "/news"         },
  { icon: Compass,         label: "Discover",        href: "/search"       },
  { icon: BookOpen,        label: "Reading list",    href: "/reading-list" },
];

const editorRoutes = [
  { icon: List,     label: "Manage posts", href: "/editor/writers"   },
  { icon: BarChart, label: "Analytics",    href: "/editor/analytics" },
];

const companyRoutes = [
  { icon: Info,      label: "About",    href: "/about"   },
  { icon: Briefcase, label: "Services", href: "/services" },
  { icon: Phone,     label: "Contact",  href: "/contact" },
];

const platformRoutes = [
  { icon: Building2,     label: "Maxnovate",  href: "/",                            external: false, available: true },
  { icon: GraduationCap, label: "InstaSkul",  href: "https://instaskul.com",        external: true,  available: true },
  { icon: Sparkles,      label: "Studio AI",  href: "https://studio.maxnovate.com", external: true,  available: true },
  { icon: ShoppingBag,   label: "Vendly",     href: "https://vendly.com",           external: true,  available: true },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith("/editor");
  const routes = isEditorPage ? editorRoutes : readerRoutes;

  return (
    <div className="flex flex-col w-full h-full">

      {/* Primary nav */}
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

      {/* Company pages — reader view only */}
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

      {/* Platform switcher — pinned to bottom */}
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
            external={app.external}
            disabled={!app.available}
          />
        ))}
      </div>

    </div>
  );
};
