import { ButtonHTMLAttributes, forwardRef } from "react";
import { classNames } from "../../utils/tw.utils";

export type ButtonSubmitProps = ButtonHTMLAttributes<HTMLButtonElement>;

const FormButtonSubmit = forwardRef<HTMLButtonElement, ButtonSubmitProps>(
  ({ className, type, ...rest }, ref) => {
    return (
      <button
        {...rest}
        ref={ref}
        type="submit"
        className={classNames(
          "group inline-flex items-center justify-center gap-2 rounded-[10px] bg-linear-to-r from-[#2563EB] to-[#4F46E5] px-4 py-2.5 text-xs font-bold text-text-on-accent hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all",
          className,
        )}
      />
    );
  },
);

FormButtonSubmit.displayName = "FormButtonSubmit";

export { FormButtonSubmit };
