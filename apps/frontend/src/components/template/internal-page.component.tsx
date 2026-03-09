"use client";

import { Header } from "./header.component";
import { MenuArea } from "./menu-area.component";

interface InternalPageProps {
  children?: React.ReactNode;
}

export function InternalPage({ children }: InternalPageProps) {
  return (
    <div>
      <MenuArea />
      <div className="lg:pl-[280px]">
        <Header />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
