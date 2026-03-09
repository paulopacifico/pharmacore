"use client";
import {
    ListBulletIcon,
    ShoppingCartIcon,
    ArrowLeftCircleIcon,
    Squares2X2Icon,
    TagIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { MenuSection } from "@pharmacore/shared-web";

export function ProductMenu() {
    const pathname = usePathname();
    const navigation = [
        {
            items: [
                {
                    name: "Dashboard",
                    href: "/admin/products",
                    icon: Squares2X2Icon,
                    current: pathname === "/admin/products",
                },
                {
                    name: "Catálogo",
                    href: "/admin/products/catalog",
                    icon: ShoppingBagIcon,
                    current: pathname === "/admin/products/catalog",
                },
            ],
        },
        {
            title: "Gerenciamento",
            items: [
                {
                    name: "Produtos",
                    href: "/admin/products/list",
                    icon: ShoppingCartIcon,
                    current: pathname?.startsWith("/admin/products/list"),
                },
                {
                    name: "Categorias",
                    href: "/admin/products/categories",
                    icon: ListBulletIcon,
                    current: pathname?.startsWith("/admin/products/categories"),
                },
                {
                    name: "Marcas",
                    href: "/admin/products/brands",
                    icon: TagIcon,
                    current: pathname?.startsWith("/admin/products/brands"),
                },
            ],
        },
        {
            title: "Outros",
            items: [
                {
                    name: "Voltar",
                    href: "/dashboard",
                    icon: ArrowLeftCircleIcon,
                    current: pathname?.startsWith("/dashboard"),
                },
            ],
        },
    ];

    return (
        <nav className="relative flex flex-1 flex-col gap-y-7">
            {navigation.map((section, index) => (
                <MenuSection
                    key={index}
                    title={section.title}
                    items={section.items}
                />
            ))}
        </nav>
    );
}
