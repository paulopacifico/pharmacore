"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbHookProps {
  name: string;
  href: string;
  current: boolean;
}

const translations: Record<string, string> = {
  users: "Usuários",
  create: "Criar",
  edit: "Editar",
  roles: "Perfis",
  permissions: "Permissões",
  products: "Produtos",
  categories: "Categorias",
  stock: "Estoque",
  branch: "Filiais",
  branches: "Filiais",
  admin: "Admin",
};

const translate = (segment: string) => {
  if (!segment) return "";
  return (
    translations[segment.toLowerCase()] ||
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
};

const NAVIGABLE_SEGMENTS = new Set([
  "auth",
  "admin",
  "users",
  "roles",
  "products",
  "categories",
  "branches",
  "list",
  "create",
  "edit",
  "profile",
]);

export const useBreadcrumb = (): BreadcrumbHookProps[] => {
  const pathname = usePathname();

  return useMemo(() => {
    if (!pathname) return [];

    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs: BreadcrumbHookProps[] = [
      { name: "Início", href: "/dashboard", current: false },
    ];

    let accumulatedPath: string[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const next = segments[i + 1];

      accumulatedPath.push(segment!);

      const isId = /^[0-9a-fA-F-]{6,}$/.test(segment!);
      if (isId) continue;

      const isNavigable = NAVIGABLE_SEGMENTS.has(segment!);
      if (!isNavigable) continue;

      const hrefPath =
        next && /^[0-9a-fA-F-]{6,}$/.test(next)
          ? [...accumulatedPath, next]
          : accumulatedPath;

      breadcrumbs.push({
        name: translate(segment!),
        href: "/" + hrefPath.join("/"),
        current: false,
      });
    }

    breadcrumbs.forEach((b, i) => {
      b.current = i === breadcrumbs.length - 1;
    });

    return breadcrumbs.filter(Boolean);
  }, [pathname]);
};
