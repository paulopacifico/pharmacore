"use client";

import { ReactNode } from "react";
import { classNames } from "../../utils/tw.utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  actions,
  children,
  className,
}: ChartCardProps) {
  return (
    <div
      className={classNames(
        "rounded-2xl border border-border-card bg-bg-card p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading text-base font-bold text-text-primary">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export const chartTheme = {
  colors: {
    blue: "#3B82F6",
    purple: "#6366F1",
    cyan: "#06B6D4",
    success: "#10b981",
    error: "#f43f5e",
    warning: "#f59e0b",
  },
  tooltip: {
    contentStyle: {
      backgroundColor: "var(--color-bg-card)",
      border: "1px solid var(--color-border-card)",
      borderRadius: "8px",
      color: "var(--color-text-primary)",
      fontSize: "13px",
    },
  },
  grid: {
    stroke: "var(--color-border-card)",
    strokeDasharray: "3 3",
  },
  axis: {
    tick: { fill: "var(--color-text-muted)", fontSize: 12 },
  },
};
