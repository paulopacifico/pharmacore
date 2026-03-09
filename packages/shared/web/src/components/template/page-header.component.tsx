"use client";

import { ReactNode } from "react";
import { classNames } from "../../utils/tw.utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={classNames("mb-6", className)}>
      {breadcrumb && <div className="mb-3">{breadcrumb}</div>}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-[22px] font-bold text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[13px] text-text-muted">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end lg:w-auto lg:flex-nowrap lg:shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
