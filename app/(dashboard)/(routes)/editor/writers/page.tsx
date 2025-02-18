import { Button } from "@/components/ui/button";
import Link from "next/link";

const WritersPage = () => {
  return (
    <Link href={"/editor/create"}>
      <div>
        <Button className="p-6">New writer</Button>
      </div>
    </Link>
  );
};

export default WritersPage;
