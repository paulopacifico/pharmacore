"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { InputHTMLAttributes, forwardRef } from "react";
import { classNames } from "../../utils/tw.utils";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  compact?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ compact = false, className, ...props }, ref) => {
    return (
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
        <input
          ref={ref}
          type="search"
          className={classNames(
            "w-full pl-9 pr-3 bg-bg-input border border-border-input rounded-[var(--radius-sm)] text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none",
            compact ? "py-2" : "py-2.5",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
