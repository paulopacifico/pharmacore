"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { classNames } from "../../utils/tw.utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={classNames(
          "block w-full rounded-[10px] border border-border-input bg-bg-input px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue",
          "read-only:brightness-75 read-only:cursor-not-allowed",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
