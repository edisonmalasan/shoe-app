import { ReactNode } from "react";
import DashboardNavigation from "../components/dashboard/DashboardNavigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* default max-w-7xl */}
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-white ">
        <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 text-6xl">
          <DashboardNavigation />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="shrink-0 md:hidden"
              variant="outline"
              size="icon"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-6 text-lg font-medium mt-6 pl-5">
              <DashboardNavigation />
            </nav>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}
