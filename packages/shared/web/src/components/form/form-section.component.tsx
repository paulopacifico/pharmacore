"use client";

import { classNames } from "@pharmacore/shared-web";

export interface FormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:gap-7">
        <div className="w-full lg:w-[250px] lg:shrink-0">
          <h2 className="font-heading text-[15px] font-bold text-text-primary">{title}</h2>
          <p className="mt-1.5 text-xs leading-[1.3] text-text-muted">{description}</p>
        </div>

        <div
          className={classNames(
            "flex-1 space-y-4",
            className,
          )}
        >
          {children}
        </div>
      </div>
      <div className="h-px bg-[#353C58]"></div>
    </div>
  );
}
