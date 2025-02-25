"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { Suspense } from "react";

export const NavbarRoutes = () => {
  useAuth();
  const pathname = usePathname();
  const isEditorPage = pathname?.startsWith("/editor");
  const isWriterPage = pathname?.includes("/writers");
  const isSearchPage = pathname === "/search";
  const isHomePage = pathname === "/";
  return (
    <>
      {isSearchPage || isHomePage ? (
        <div className="hidden md:block">
          <Suspense fallback={<>Loading...</>}>
            <SearchInput />
          </Suspense>
        </div>
      ) : (
        <div className="flex gap-x-2 ml-auto">
            {isEditorPage || isWriterPage && (
              <Link href={"/"}>
                <Button size={"sm"} variant={"ghost"}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit
                </Button>
              </Link>
            )} : isEditor ? (
            <Link href={"editor/writers"}>
              <Button size={"sm"} variant={"ghost"}>
                Editor mode
              </Button>
            </Link>
          ) : null
          <UserButton afterSwitchSessionUrl="/" />
        </div>)}
    </>
  );
};
