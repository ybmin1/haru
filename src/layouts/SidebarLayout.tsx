import Sidebar from "@/components/Sidebar";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { GrClose } from "react-icons/gr";
import { GrMenu } from "react-icons/gr";

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)"); // xl = 1280px
    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setIsOpen(false);
      }
    };
    handleResize(mediaQuery);
    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div className="min-w-[320px] px-4 xl:px-28 py-10 relative">
      <button
        onClick={() => setIsOpen?.(!isOpen)}
        className="absolute top-2 xl:hidden font-bold flex justify-center items-center gap-1 px-1 cursor-pointer"
      >
        <span>{isOpen ? <GrClose /> : <GrMenu />}</span>
        <span>Menu</span>
      </button>
      <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-2 relative">
        <div className="flex flex-col xl:w-[272px] bg-gray-100">
          {/*desktop sidebar */}
          <div className="hidden xl:block w-[272px] shrink-0">
            <Sidebar />
          </div>
          {/*mobile sidebar */}
          {isOpen && (
            <div className="absolute top-0 left-0 h-full w-full z-50 xl:hidden rounded-lg bg-white/70 backdrop-blur-md">
              <Sidebar />
            </div>
          )}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
