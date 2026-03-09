"use client";

import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { BreadcrumbHookProps } from "../../data";
import { classNames } from "../../utils/tw.utils";

interface BreadcrumbProps {
  items: BreadcrumbHookProps[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol role="list" className="flex min-w-max items-center gap-2 pr-1">
        {items.map((page, index) => (
          <li key={page.name}>
            <div className="flex items-center">
              {index === 0 ? (
                <Link
                  href={page.href}
                  className="text-text-muted hover:text-text-secondary transition-colors"
                >
                  <HomeIcon aria-hidden="true" className="size-4 shrink-0" />
                  <span className="sr-only">Home</span>
                </Link>
              ) : (
                <>
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-text-muted"
                  />
                  <Link
                    href={page.href}
                    aria-current={page.current ? "page" : undefined}
                    className={classNames(
                      "ml-2 text-[13px] font-medium transition-colors",
                      page.current
                        ? "text-text-primary"
                        : "text-text-muted hover:text-text-secondary",
                    )}
                  >
                    {page.name}
                  </Link>
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
