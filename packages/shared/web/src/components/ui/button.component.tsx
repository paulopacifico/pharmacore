import { ButtonHTMLAttributes, forwardRef } from "react";
import { classNames } from "../../utils/tw.utils";

const variants = {
  primary:
    "bg-linear-to-r from-[#2563EB] to-[#4F46E5] text-text-on-accent hover:brightness-110 focus-visible:ring-accent-blue",
  secondary:
    "border border-border-card bg-bg-card text-text-secondary hover:bg-bg-card-hover focus-visible:ring-border-strong",
  ghost:
    "text-text-secondary hover:bg-bg-card-hover hover:text-text-primary focus-visible:ring-border-subtle",
  danger:
    "bg-status-error text-text-on-accent hover:bg-status-error/90 focus-visible:ring-status-error",
} as const;

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-[38px] px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2.5",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconRight,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={classNames(
          "inline-flex items-center justify-center font-medium rounded-[var(--radius-btn)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
