import { ReactNode } from "react";
import DashboardNavigation from "../components/dashboard/DashboardNavigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-white">
        <DashboardNavigation />
      </header>
    </div>
  );
}
