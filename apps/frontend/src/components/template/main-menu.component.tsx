"use client";

import {
    BuildingStorefrontIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    CubeIcon,
    HomeIcon,
    IdentificationIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { classNames } from "@pharmacore/shared-web";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS, PermissionDTO } from "@pharmacore/auth";

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ElementType;
    current: boolean;
    requiredPermissions: PermissionDTO[];
}

const navigation: NavigationItem[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: HomeIcon,
        current: true,
        requiredPermissions: [PERMISSIONS.BASIC.USER.READ_OWN],
    },

    {
        name: "Auth Module",
        href: "/admin/auth",
        requiredPermissions: [PERMISSIONS.AUTH.MODULE.VIEW],
        current: false,
        icon: IdentificationIcon,
    },
    {
        name: "Módulo de Produtos",
        href: "/admin/products",
        icon: Squares2X2Icon,
        current: false,
        requiredPermissions: [PERMISSIONS.PRODUCT.MODULE.VIEW],
    },
    {
        name: "Catálogo de Produtos",
        href: "/admin/products/catalog",
        icon: ShoppingBagIcon,
        current: false,
        requiredPermissions: [PERMISSIONS.PRODUCT.MODULE.VIEW],
    },
    {
        name: "Gestão de Filiais",
        href: "/admin/branches",
        icon: BuildingStorefrontIcon,
        current: false,
        requiredPermissions: [PERMISSIONS.BRANCH.MODULE.VIEW],
    },
    {
        name: "Gestão de Estoque",
        href: "#",
        icon: CubeIcon,
        current: false,
        requiredPermissions: [PERMISSIONS.STOCK.MODULE.VIEW],
    },
    {
        name: "Ponto de Venda",
        href: "#",
        icon: ShoppingCartIcon,
        current: false,
        requiredPermissions: [PERMISSIONS.SALES.MODULE.VIEW],
    },
    {
        name: "Relatórios",
        href: "#",
        icon: ChartPieIcon,
        current: false,
        requiredPermissions: [PERMISSIONS.AUTH.AUDIT.READ],
    },
];

export function MainMenu() {
    return (
        <nav className="relative flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                    <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                            <Can
                                key={item.name}
                                requiredPermissions={item.requiredPermissions}
                            >
                                <li>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? "bg-white/5 text-white"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white",
                                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                                        )}
                                    >
                                        <item.icon
                                            aria-hidden="true"
                                            className={classNames(
                                                item.current
                                                    ? "text-white"
                                                    : "text-gray-400 group-hover:text-white",
                                                "size-6 shrink-0",
                                            )}
                                        />
                                        {item.name}
                                    </a>
                                </li>
                            </Can>
                        ))}
                    </ul>
                </li>
                <li className="mt-auto">
                    <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                        <Cog6ToothIcon
                            aria-hidden="true"
                            className="size-6 shrink-0 text-gray-400 group-hover:text-white"
                        />
                        Settings
                    </a>
                </li>
            </ul>
        </nav>
    );
}
