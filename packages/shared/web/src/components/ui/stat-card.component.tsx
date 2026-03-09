import { classNames } from "../../utils/tw.utils";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  className?: string;
}

export function StatCard({ icon, value, label, className }: StatCardProps) {
  return (
    <div
      className={classNames(
        "flex items-center gap-4 rounded-[var(--radius-card)] bg-bg-card border border-border-card p-5",
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-[10px] bg-bg-card-hover text-text-muted shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-heading text-xl font-bold text-text-primary">{value}</p>
        <p className="text-[13px] text-text-muted">{label}</p>
      </div>
    </div>
  );
}
