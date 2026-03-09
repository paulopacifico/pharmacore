"use client";
import { useState } from "react";
import { useCategory } from "../../../data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Breadcrumb,
    Button,
    DataTableContainer,
    Dialog,
    getErrorMessage,
    PageHeader,
    Table,
    TableAction,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    TableSkeleton,
} from "@pharmacore/shared-web";
import { toast } from "sonner";
import {
    PlusIcon,
    TrashIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";

export function CategoryListPage() {
    const router = useRouter();
    const { isLoadingCategories, categories, deleteCategory } = useCategory();
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(
        null,
    );

    function openDeleteDialog(id: string) {
        setCategoryToDelete(id);
    }

    async function handleDelete() {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete);
            toast.success("Categoria excluída com sucesso");
        } catch (error) {
            toast.error("Erro ao excluir a categoria.", {
                description: getErrorMessage(error),
            });
        } finally {
            setCategoryToDelete(null);
        }
    }

    return (
        <>
            <Dialog
                isOpen={Boolean(categoryToDelete)}
                type="delete"
                title="Excluir Categoria"
                onClose={() => setCategoryToDelete(null)}
                onConfirm={handleDelete}
            >
                Tem certeza que deseja excluir esta categoria? Esta ação não
                pode ser desfeita.
            </Dialog>

            <PageHeader
                title="Categorias"
                subtitle="Gerencie categorias, subcategorias e ações de manutenção."
                breadcrumb={
                    <Breadcrumb
                        items={[
                            {
                                name: "Início",
                                href: "/dashboard",
                                current: false,
                            },
                            {
                                name: "Catálogo",
                                href: "/admin/products",
                                current: false,
                            },
                            {
                                name: "Categorias",
                                href: "/admin/products/categories",
                                current: true,
                            },
                        ]}
                    />
                }
                actions={
                    <Can
                        requiredPermissions={[
                            PERMISSIONS.PRODUCT.CATEGORY.CREATE,
                        ]}
                    >
                        <Button
                            icon={<PlusIcon className="h-4 w-4" />}
                            onClick={() => router.push("/admin/products/categories/create")}
                        >
                            Adicionar categoria
                        </Button>
                    </Can>
                }
            />

            {isLoadingCategories ? (
                <TableSkeleton />
            ) : (
                <DataTableContainer>
                    <div className="p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-heading text-[17px] font-semibold text-text-primary">
                                    Lista de Categorias
                                </h3>
                                <p className="text-xs text-text-muted">
                                    Nome, quantidade de subcategorias e lista de
                                    subcategorias.
                                </p>
                            </div>
                            <span className="rounded-full border border-border-input bg-bg-input px-3 py-2 text-xs text-text-secondary">
                                Ordenação visual
                            </span>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-2 rounded-btn border border-border-input bg-bg-input px-3.5 py-2.5">
                            <svg
                                className="h-4 w-4 text-text-muted shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                            <span className="text-[13px] text-text-secondary">
                                Buscar por categoria ou subcategoria
                            </span>
                        </div>

                        {/* Inner Table */}
                        <div className="overflow-hidden rounded-xl border border-border-card bg-bg-card-hover/50">
                            <Can
                                requiredPermissions={[
                                    PERMISSIONS.PRODUCT.CATEGORY.READ,
                                ]}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeaderCell
                                                scope="col"
                                                className="w-[250px]"
                                            >
                                                Nome
                                            </TableHeaderCell>
                                            <TableHeaderCell
                                                scope="col"
                                                className="w-[190px]"
                                            >
                                                Qtde Subcategorias
                                            </TableHeaderCell>
                                            <TableHeaderCell scope="col">
                                                Subcategorias
                                            </TableHeaderCell>
                                            <TableHeaderCell
                                                scope="col"
                                                className="w-[180px] text-right"
                                            >
                                                Ações
                                            </TableHeaderCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categories.map((category: any) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="w-62.5">
                                                    {category.name}
                                                </TableCell>
                                                <TableCell className="w-47.5">
                                                    {category.subcategories
                                                        ?.length || 0}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className="inline-block max-w-100 truncate align-bottom"
                                                        title={
                                                            category.subcategories
                                                                ?.map(
                                                                    (
                                                                        sub: any,
                                                                    ) =>
                                                                        sub.name,
                                                                )
                                                                .join(", ") ||
                                                            "-"
                                                        }
                                                    >
                                                        {category.subcategories
                                                            ?.map(
                                                                (sub: any) =>
                                                                    sub.name,
                                                            )
                                                            .join(", ") || "-"}
                                                    </span>
                                                </TableCell>
                                                <TableAction className="w-45">
                                                    <div className="flex gap-3 justify-end items-center">
                                                        <Can
                                                            requiredPermissions={[
                                                                PERMISSIONS
                                                                    .PRODUCT
                                                                    .CATEGORY
                                                                    .UPDATE,
                                                            ]}
                                                        >
                                                            <Link
                                                                href={`/admin/products/categories/edit/${category.id}`}
                                                                className="inline-flex items-center gap-1.5 text-text-secondary transition-colors hover:text-text-primary"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    ,{" "}
                                                                    {
                                                                        category.name
                                                                    }
                                                                </span>
                                                            </Link>
                                                        </Can>
                                                        <Can
                                                            requiredPermissions={[
                                                                PERMISSIONS
                                                                    .PRODUCT
                                                                    .CATEGORY
                                                                    .DELETE,
                                                            ]}
                                                        >
                                                            <button
                                                                className="inline-flex items-center gap-1.5 text-status-error transition-colors hover:opacity-80"
                                                                onClick={() => {
                                                                    if (
                                                                        category.id
                                                                    ) {
                                                                        openDeleteDialog(
                                                                            category.id,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    ,{" "}
                                                                    {
                                                                        category.name
                                                                    }
                                                                </span>
                                                            </button>
                                                        </Can>
                                                    </div>
                                                </TableAction>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Can>
                        </div>
                    </div>
                </DataTableContainer>
            )}
        </>
    );
}
