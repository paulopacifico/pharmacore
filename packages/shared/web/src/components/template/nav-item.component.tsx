"use client";

import Link from "next/link";
import { classNames } from "../../utils/tw.utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

export function NavItem({ href, icon: Icon, label, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={classNames(
        "flex items-center gap-3.5 px-4 py-3 rounded-[var(--radius-sm)] text-sm transition-colors",
        active
          ? "bg-nav-active-bg text-text-primary font-medium"
          : "text-text-secondary hover:bg-bg-card-hover hover:text-text-primary font-normal",
      )}
    >
      <Icon
        aria-hidden="true"
        className={classNames(
          "size-5 shrink-0",
          active ? "text-text-primary" : "text-text-muted",
        )}
      />
      <span>{label}</span>
    </Link>
  );
}
