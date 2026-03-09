"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, useBreadcrumb } from "@pharmacore/shared-web";

export function BreadcrumbWrapper() {
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumb();

  if (pathname === "/" || pathname === "/dashboard") {
    return null;
  }
  return (
    <div className="pt-4 pb-6 text-white border-r-green-800  sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbs} />
    </div>
  );
}
