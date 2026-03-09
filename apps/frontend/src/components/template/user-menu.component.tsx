"use client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import { Loading } from "@pharmacore/shared-web";

import { classNames } from "@pharmacore/shared-web";
import Link from "next/link";
import { Can, useAuth } from "@pharmacore/auth-web";
import {
    ArrowRightStartOnRectangleIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { PERMISSIONS } from "@pharmacore/auth";

export function UserMenu() {
    const { user, logout } = useAuth();
    const items = [
        {
            name: "Meu Perfil",
            href: "/profile",
            requiredPermissions: [PERMISSIONS.BASIC.USER.READ_OWN],
            icon: UserIcon,
        },
        {
            name: "Sair",
            href: "#",
            requiredPermissions: [PERMISSIONS.BASIC.USER.READ_OWN],
            onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                logout();
                window.location.href = "/";
            },
            icon: ArrowRightStartOnRectangleIcon,
        },
    ];

    const userAvatar =
        user?.avatarUrl ??
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

    return (
        <Menu as="div" className="relative">
            <MenuButton className="relative flex items-center">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Abrir menu do usuário</span>
                {user ? (
                    <>
                        <Image
                            alt=""
                            src={userAvatar}
                            className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                            width={32}
                            height={32}
                        />
                        <span className="hidden lg:flex lg:items-center">
                            <span
                                aria-hidden="true"
                                className="ml-4 text-sm/6 font-semibold text-text-primary"
                            >
                                {user?.name}
                            </span>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="ml-2 size-5 text-text-muted"
                            />
                        </span>
                    </>
                ) : (
                    <Loading />
                )}
            </MenuButton>
            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2.5 w-52 origin-top-right rounded-md border border-border-subtle bg-bg-card py-2 outline-1 -outline-offset-1 outline-border-subtle transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
                {items.map((item) => (
                    <Can
                        key={item.name}
                        requiredPermissions={item.requiredPermissions}
                    >
                        <MenuItem>
                            {({ focus }) => (
                                <Link
                                    href={item.href}
                                    className={classNames(
                                        focus ? "bg-bg-card-hover" : "",
                                        "flex items-center px-3 py-1 text-sm/6 text-text-primary",
                                    )}
                                    onClick={item.onClick}
                                >
                                    {item.icon && (
                                        <item.icon
                                            className="mr-3 h-5 w-5 text-text-muted"
                                            aria-hidden="true"
                                        />
                                    )}
                                    {item.name}
                                </Link>
                            )}
                        </MenuItem>
                    </Can>
                ))}
            </MenuItems>
        </Menu>
    );
}
