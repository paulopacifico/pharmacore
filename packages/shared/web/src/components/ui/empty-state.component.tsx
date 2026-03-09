import { classNames } from "../../utils/tw.utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-text-muted">{icon}</div>
      )}
      <h3 className="font-heading text-lg font-bold text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-text-muted max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
