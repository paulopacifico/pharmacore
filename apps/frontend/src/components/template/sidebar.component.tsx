"use client";

import { useState, useRef, useEffect } from "react";
import {
    HomeIcon,
    IdentificationIcon,
    Squares2X2Icon,
    BuildingStorefrontIcon,
    CubeIcon,
    ShoppingCartIcon,
    ChartPieIcon,
    ChevronDownIcon,
    ArrowLeftIcon,
    UsersIcon,
    ShieldCheckIcon,
    ShoppingBagIcon,
    TagIcon,
    CheckIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { NavItem, Logo } from "@pharmacore/shared-web";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS, PermissionDTO } from "@pharmacore/auth";
import { usePathname } from "next/navigation";
import { useBranchSelectorData } from "@pharmacore/branch-web";

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ElementType;
    current: boolean;
    requiredPermissions: PermissionDTO[];
}

interface ModuleConfig {
    basePath: string;
    label: string;
    items: { name: string; href: string; icon: React.ElementType }[];
}

const modules: ModuleConfig[] = [
    {
        basePath: "/admin/auth",
        label: "Autenticação",
        items: [
            { name: "Dashboard", href: "/admin/auth", icon: HomeIcon },
            { name: "Usuários", href: "/admin/auth/users", icon: UsersIcon },
            {
                name: "Perfis",
                href: "/admin/auth/roles",
                icon: ShieldCheckIcon,
            },
        ],
    },
    {
        basePath: "/admin/products",
        label: "Catálogo de Produtos",
        items: [
            { name: "Dashboard", href: "/admin/products", icon: HomeIcon },
            {
                name: "Produtos",
                href: "/admin/products/list",
                icon: ShoppingBagIcon,
            },
            {
                name: "Categorias",
                href: "/admin/products/categories",
                icon: TagIcon,
            },
            {
                name: "Marcas",
                href: "/admin/products/brands",
                icon: BuildingStorefrontIcon,
            },
            {
                name: "Catálogo",
                href: "/admin/products/catalog",
                icon: Squares2X2Icon,
            },
        ],
    },
    {
        basePath: "/admin/branches",
        label: "Gestão de Filiais",
        items: [
            {
                name: "Dashboard",
                href: "/admin/branches",
                icon: HomeIcon,
            },
            {
                name: "Filiais",
                href: "/admin/branches/list",
                icon: BuildingStorefrontIcon,
            },
        ],
    },
];

const navigation: NavigationItem[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: HomeIcon,
        current: true,
        requiredPermissions: [PERMISSIONS.BASIC.USER.READ_OWN],
    },
    {
        name: "Autenticação",
        href: "/admin/auth",
        requiredPermissions: [PERMISSIONS.AUTH.MODULE.VIEW],
        current: false,
        icon: IdentificationIcon,
    },
    {
        name: "Módulo de Produtos",
        href: "/admin/products",
        icon: ShoppingBagIcon,
        current: false,
        requiredPermissions: [PERMISSIONS.PRODUCT.MODULE.VIEW],
    },
    {
        name: "Catálogo de Produtos",
        href: "/admin/products/catalog",
        icon: Squares2X2Icon,
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

export function Sidebar() {
    const pathname = usePathname();
    const {
        branches,
        isLoading,
        search,
        setSearch,
        selectedBranch,
        setSelectedBranch,
    } = useBranchSelectorData();

    const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const activeModule = modules.find((m) => pathname.startsWith(m.basePath));

    function closeDropdown() {
        setBranchDropdownOpen(false);
        setSearch("");
    }

    useEffect(() => {
        if (branchDropdownOpen) {
            searchInputRef.current?.focus();
        }
    }, [branchDropdownOpen]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                closeDropdown();
            }
        }
        if (branchDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [branchDropdownOpen]);

    return (
        <aside className="flex h-full w-[280px] flex-col bg-bg-sidebar border-r border-border-subtle">
            <div className="flex flex-1 flex-col gap-5 px-[22px] py-6 overflow-y-auto">
                <div className="flex items-center gap-3 px-1">
                    <Logo className="h-8" />
                    <span className="font-heading text-lg font-bold text-text-primary">
                        PharmaCore
                    </span>
                </div>

                <div
                    className="rounded-[12px] border border-accent-blue bg-nav-active-bg p-3"
                    ref={dropdownRef}
                >
                    <p className="mb-2.5 text-xs font-semibold text-text-primary">
                        Filtro de filial
                    </p>
                    <button
                        className="flex w-full items-center gap-2.5 rounded-[10px] border border-border-subtle bg-bg-card px-3 py-2.5"
                        onClick={() =>
                            setBranchDropdownOpen(!branchDropdownOpen)
                        }
                    >
                        <BuildingStorefrontIcon className="size-4 shrink-0 text-accent-blue" />
                        <div className="flex-1 text-left">
                            <p className="text-[13px] font-bold text-text-primary">
                                {selectedBranch
                                    ? `${selectedBranch.name}${selectedBranch.address?.city ? ` • ${selectedBranch.address.city}` : ""}`
                                    : "Selecionar filial"}
                            </p>
                            <p className="text-[11px] text-text-secondary">
                                {selectedBranch
                                    ? "Clique para trocar unidade"
                                    : "Nenhuma filial selecionada"}
                            </p>
                        </div>
                        <ChevronDownIcon
                            className={`size-3.5 shrink-0 text-text-muted transition-transform ${branchDropdownOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {branchDropdownOpen && (
                        <div className="mt-2 rounded-[8px] border border-border-subtle bg-bg-card">
                            <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2">
                                <MagnifyingGlassIcon className="size-3.5 shrink-0 text-text-muted" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar filial..."
                                    className="w-full bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none"
                                />
                            </div>

                            <div className="max-h-[180px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {isLoading && (
                                    <p className="px-3 py-3 text-[11px] text-text-muted">
                                        Buscando...
                                    </p>
                                )}

                                {!isLoading && branches.length === 0 && (
                                    <p className="px-3 py-3 text-[11px] text-text-muted">
                                        Nenhuma filial encontrada
                                    </p>
                                )}

                                {!isLoading &&
                                    branches.map((branch) => (
                                        <button
                                            key={branch.id}
                                            className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-bg-card-hover ${selectedBranch?.id === branch.id ? "bg-bg-card-hover" : ""}`}
                                            onClick={() => {
                                                setSelectedBranch(branch);
                                                closeDropdown();
                                            }}
                                        >
                                            <div
                                                className={`size-2 rounded-full shrink-0 ${branch.isActive ? "bg-[#06B6D4]" : "bg-[#64748b]"}`}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-[12px] font-medium text-text-primary">
                                                    {branch.name}
                                                </p>
                                                {branch.address?.city && (
                                                    <p className="truncate text-[10px] text-text-muted">
                                                        {branch.address.city}
                                                        {branch.address.state
                                                            ? `/${branch.address.state}`
                                                            : ""}
                                                    </p>
                                                )}
                                            </div>
                                            {selectedBranch?.id ===
                                                branch.id && (
                                                <CheckIcon className="size-3.5 shrink-0 text-accent-cyan" />
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {activeModule ? (
                    <nav className="flex flex-col gap-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-muted transition-colors hover:text-text-primary"
                        >
                            <ArrowLeftIcon className="size-4" />
                            Voltar
                        </Link>
                        <p className="mt-2 mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                            {activeModule.label}
                        </p>
                        {activeModule.items.map((item) => (
                            <NavItem
                                key={item.name}
                                href={item.href}
                                icon={item.icon}
                                label={item.name}
                                active={pathname === item.href}
                            />
                        ))}
                    </nav>
                ) : (
                    <nav className="flex flex-col gap-1">
                        {navigation.map((item) => (
                            <Can
                                key={item.name}
                                requiredPermissions={item.requiredPermissions}
                            >
                                <NavItem
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.name}
                                    active={
                                        pathname === item.href ||
                                        pathname.startsWith(item.href + "/")
                                    }
                                />
                            </Can>
                        ))}
                    </nav>
                )}
            </div>
        </aside>
    );
}
