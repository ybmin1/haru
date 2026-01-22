import Sidebar from "@/components/Sidebar";

import { ReactNode } from "react";

export default function SidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-20 py-7">
      <div className="px-8">
        <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-2">
          <Sidebar />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
