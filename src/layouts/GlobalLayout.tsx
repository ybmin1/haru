import Header from "@/components/Header";
import SidebarLayout from "@/layouts/SidebarLayout";

import { ReactNode } from "react";

export default function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <SidebarLayout>
        <main>{children}</main>
      </SidebarLayout>
      <footer>footer</footer>
    </>
  );
}
