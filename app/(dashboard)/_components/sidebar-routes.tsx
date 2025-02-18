"use client"

import { BarChart, Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search"
    }
];
const editorRoutes = [
  {
    icon: List,
    label: "Writers",
    href: "/editor/writers",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/editor/analytics",
  },
];
export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isEditorPage = pathname?.includes("/editor");
    const routes = isEditorPage ? editorRoutes : guestRoutes;
    
    return ( 
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
     );
}
 
