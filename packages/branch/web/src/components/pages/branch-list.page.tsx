"use client";

import { Breadcrumb, PageHeader } from "@pharmacore/shared-web";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { BranchesFilter, BranchesTable } from "../shared";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";

export function BranchListPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Filiais"
                subtitle="Filiais cadastradas, prontas para edição."
                breadcrumb={
                    <Breadcrumb
                        items={[
                            {
                                name: "Início",
                                href: "/dashboard",
                                current: false,
                            },
                            {
                                name: "Filiais",
                                href: "/admin/branches",
                                current: false,
                            },
                            {
                                name: "Lista",
                                href: "/admin/branches/list",
                                current: true,
                            },
                        ]}
                    />
                }
                actions={
                    <Can requiredPermissions={[PERMISSIONS.BRANCH.CREATE]}>
                        <Link
                            href="/admin/branches/create"
                            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-[13px] font-medium text-white hover:bg-indigo-400 transition-colors"
                        >
                            <PlusIcon className="size-4" />
                            Criar Filial
                        </Link>
                    </Can>
                }
            />
            <Can requiredPermissions={[PERMISSIONS.BRANCH.READ]}>
                <BranchesFilter />
                <BranchesTable />
            </Can>
        </div>
    );
}
