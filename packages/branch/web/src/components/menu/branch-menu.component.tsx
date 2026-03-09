"use client";
import {
    ArrowLeftCircleIcon,
    Cog6ToothIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "@pharmacore/shared-web";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PermissionDTO, PERMISSIONS } from "@pharmacore/auth";
import { Can } from "@pharmacore/auth-web";

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ElementType;
    current: boolean;
    requiredPermissions: PermissionDTO[];
}

export function BranchMenu() {
    const pathname = usePathname();
    const navigation: NavigationItem[] = [
        {
            name: "Gestão de Filiais",
            href: "/admin/branches",
            icon: Cog6ToothIcon,
            current: pathname === "/admin/branches",
            requiredPermissions: [PERMISSIONS.BRANCH.MODULE.VIEW],
        },
        {
            name: "Filiais",
            href: "/admin/branches/list",
            icon: ListBulletIcon,
            current: pathname?.startsWith("/admin/branches/list"),
            requiredPermissions: [PERMISSIONS.BRANCH.MODULE.VIEW],
        },
        {
            name: "Voltar",
            href: "/dashboard",
            icon: ArrowLeftCircleIcon,
            current: pathname?.startsWith("/dashboard"),
            requiredPermissions: [PERMISSIONS.BRANCH.MODULE.VIEW],
        },
    ];

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
                                <li key={item.name}>
                                    <Link
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
                                    </Link>
                                </li>
                            </Can>
                        ))}
                    </ul>
                </li>
            </ul>
        </nav>
    );
}
