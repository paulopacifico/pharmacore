import { classNames } from "../../utils/tw.utils";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/20/solid";

interface KPICardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bgColor: string;
  textColor: string;
  badgeBgColor: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function KPICard({
  icon,
  value,
  label,
  bgColor,
  textColor,
  badgeBgColor,
  trend,
  className,
}: KPICardProps) {
  return (
    <div
      className={classNames(
        "rounded-2xl border border-white/10 p-5 flex flex-col gap-2.5",
        className,
      )}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex size-10 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: badgeBgColor }}
        >
          <span style={{ color: textColor }}>{icon}</span>
        </div>
        {trend && (
          <span
            className="inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1"
            style={{ backgroundColor: badgeBgColor, color: textColor }}
          >
            {trend.positive ? (
              <ArrowTrendingUpIcon className="size-3.5" />
            ) : (
              <ArrowTrendingDownIcon className="size-3.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>
      <p
        className="font-heading text-[32px] font-bold leading-tight"
        style={{ color: textColor }}
      >
        {value}
      </p>
      <span className="text-[13px]" style={{ color: textColor, opacity: 0.7 }}>
        {label}
      </span>
    </div>
  );
}
