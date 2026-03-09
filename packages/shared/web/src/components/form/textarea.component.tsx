"use client";
import { forwardRef, TextareaHTMLAttributes } from "react";
import { classNames } from "../../utils/tw.utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={classNames(
                    "block w-full rounded-[10px] border border-border-input bg-bg-input px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue",
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);

Textarea.displayName = "Textarea";

export { Textarea };
