"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export const NavbarRoutes = () => {
    const pathname = usePathname();
    // const router = useRouter();
    const isEditorPage = pathname?.startsWith("/editor");
    const isWriterPage = pathname?.includes("/article")
    return (
      <div className="flex gap-x-2 ml-auto">
        {isEditorPage || isWriterPage ? (
          <Link href={"/"}>
            <Button size={"sm"} variant={"ghost"}>
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href={"editor/writers"}>
            <Button size={"sm"} variant={"ghost"}>
              Editor mode
            </Button>
          </Link>
        )}
        <UserButton afterSwitchSessionUrl="/" />
      </div>
    );
}