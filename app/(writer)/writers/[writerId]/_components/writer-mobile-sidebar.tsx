import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Article, Writer } from "@prisma/client";
import { Menu } from "lucide-react";
import WriterSidebar from "./writer-sidebar";

interface WriterMobileSidebarProps {
    writer: Writer & {
            articles: (Article)[]
        }
}
export const WriterMobileSidebar = ({writer}: WriterMobileSidebarProps) => {
    return (
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
          <SheetTitle><Menu/></SheetTitle>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 bg-white w-72">
          <WriterSidebar writer={writer} />
        </SheetContent>
      </Sheet>
    );
}
 
