import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import WriterSidebar from "./_components/writer-sidebar";
import { WriterNavbar } from "./_components/writer-navbar";


const WriterLayout = async ({
    children,
    params,
}: { children: React.ReactNode; params: Promise<{ writerId: string }> }) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }
    const writer = await db.writer.findUnique({
        where: {
            id: (await params).writerId,
        },
        include: {
            articles: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    });
    if (!writer) {
        redirect("/");
    }

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <WriterNavbar writer={writer} />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <WriterSidebar writer={writer} />

            </div>
        <main className="md:pl-80 pt-[80px] h-full">{children}</main>
      </div>
    );
}
 
export default WriterLayout;