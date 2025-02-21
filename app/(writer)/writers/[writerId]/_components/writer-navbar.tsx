import { NavbarRoutes } from "@/components/navbar-routes";
import { Article, Writer } from "@prisma/client";
import { WriterMobileSidebar } from "./writer-mobile-sidebar";

interface WriterNavbarProps {
    writer: Writer & {
        articles: (Article)[]
    }
}

export const WriterNavbar = ({writer}: WriterNavbarProps) => {
    return ( 
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <WriterMobileSidebar writer={writer} />
            <NavbarRoutes/>
        </div>
     );
}
 
