import Link from "next/link";
import { ReactNode } from "react";

export default function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex">
        header
        <div>[Viewing: Demo Mode]</div>
        <Link href={"/goal-setup"} className="bg-gray-200">
          [Set up your own goal -&gt;]
        </Link>
      </header>
      <main>{children}</main>
      <footer>footer</footer>
    </>
  );
}
