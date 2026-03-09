import { ComponentPropsWithoutRef } from "react";
import { classNames } from "../../utils/tw.utils";

export function DataTableContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "w-full overflow-hidden rounded-[var(--radius-card)] border border-border-card bg-bg-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

type TableProps = ComponentPropsWithoutRef<"table">;
export function Table({ className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
      <table
        {...props}
        className={classNames("w-full min-w-max", className)}
      />
    </div>
  );
}

type TableHeadProps = ComponentPropsWithoutRef<"thead">;
export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <thead
      {...props}
      className={classNames("border-b border-border-card bg-bg-card-hover", className)}
    />
  );
}

type TableBodyProps = ComponentPropsWithoutRef<"tbody">;
export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      {...props}
      className={classNames("[&>tr:nth-child(odd)]:bg-bg-card [&>tr:nth-child(even)]:bg-bg-card-hover/60", className)}
    />
  );
}

type TableRowProps = ComponentPropsWithoutRef<"tr">;
export function TableRow({ className, ...props }: TableRowProps) {
  return (
      <tr
      {...props}
      className={classNames("border-b border-border-card transition-colors hover:bg-bg-card-hover", className)}
    />
  );
}

type TableHeaderCellProps = ComponentPropsWithoutRef<"th">;
export function TableHeaderCell({ className, ...props }: TableHeaderCellProps) {
  return (
    <th
      {...props}
      className={classNames(
        "px-3 py-2.5 text-left text-xs font-semibold text-text-muted sm:px-3.5 sm:py-3",
        className,
      )}
    />
  );
}

type TableCellProps = ComponentPropsWithoutRef<"td">;
export function TableCell({ align = "left", className, ...rest }: TableCellProps) {
  return (
    <td
      {...rest}
      align={align}
      className={classNames(
        "whitespace-nowrap px-3 py-2.5 text-sm text-text-primary sm:px-3.5 sm:py-3",
        className,
      )}
    />
  );
}

type TableActionProps = ComponentPropsWithoutRef<"td">;
export function TableAction({ className, ...props }: TableActionProps) {
  return (
    <td
      {...props}
      className={classNames(
        "relative whitespace-nowrap py-2.5 pl-3 pr-3 text-right text-sm font-medium sm:py-3 sm:pr-3.5",
        className,
      )}
    />
  );
}
