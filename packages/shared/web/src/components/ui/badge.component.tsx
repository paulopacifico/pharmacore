import { ReactNode, useMemo } from "react";
import { classNames } from "../../utils/tw.utils";

const allVariants = {
  default: "bg-border-subtle/40 text-text-secondary ring-1 ring-border-subtle",
  primary: "bg-accent-blue/10 text-accent-blue ring-1 ring-accent-blue/30",
  secondary: "bg-bg-input text-text-secondary ring-1 ring-border-input",
  success: "bg-status-success/10 text-status-success ring-1 ring-status-success/30",
  info: "bg-status-info/10 text-status-info ring-1 ring-status-info/30",
  warning: "bg-status-warning/10 text-status-warning ring-1 ring-status-warning/30",
  danger: "bg-status-error/10 text-status-error ring-1 ring-status-error/30",
  purple: "bg-accent-purple/10 text-accent-purple ring-1 ring-accent-purple/30",
  cyan: "bg-accent-cyan/10 text-accent-cyan ring-1 ring-accent-cyan/30",
} as const;

const sizes = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-[13px]",
} as const;

type BadgeVariant = keyof typeof allVariants;
type Size = keyof typeof sizes;

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: Size;
  className?: string;
  randomVariant?: boolean;
}

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  randomVariant = false,
}: BadgeProps) => {
  const selectedVariant = useMemo((): BadgeVariant => {
    if (!randomVariant) return variant;
    const keys = Object.keys(allVariants).filter(
      (k) => k !== "default",
    ) as BadgeVariant[];
    return keys[Math.floor(Math.random() * keys.length)]!;
  }, [randomVariant, variant]);

  return (
    <span
      className={classNames(
        "inline-flex items-center font-medium ring-inset rounded-full",
        allVariants[selectedVariant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
};

export { Badge };
export type { BadgeProps, BadgeVariant };
