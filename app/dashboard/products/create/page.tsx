import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProductRoute() {
  return (
    <form>
      <div className="flex items-center gap-4">
        <Button /*variant={"outline"} */ size={"icon"} asChild>
          <Link href={"/dashboard/products"}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </form>
  );
}
