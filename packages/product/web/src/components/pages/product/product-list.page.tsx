"use client";
import { useState } from "react";
import { useProductPagination, useProductCommand } from "../../../data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Breadcrumb,
    Button,
    DataTableContainer,
    Dialog,
    getErrorMessage,
    PageHeader,
    PaginationControls,
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
import { ProductFilter } from "../../../components";
import {
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { truncateText } from "../../../utils";

import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";
export function ProductListPage() {
    const router = useRouter();
    const {
        isLoading,
        products,
        filters,
        updateFilters,
        totalItems,
        totalPages,
        goToPage,
        refreshCurrentPage,
    } = useProductPagination();
    const { deleteProduct } = useProductCommand();
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    function openDeleteDialog(id: string) {
        setProductToDelete(id);
    }

    async function handleDelete() {
        try {
            if (!productToDelete) return;
            await deleteProduct(productToDelete!);
            await refreshCurrentPage();
            toast.success("Produto excluído com sucesso");
        } catch (error) {
            toast.error("Erro ao excluir o produto.", {
                description: getErrorMessage(error),
            });
        } finally {
            setProductToDelete(null);
        }
    }

    return (
        <>
            <Dialog
                isOpen={Boolean(productToDelete)}
                type="delete"
                title="Excluir Produto"
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDelete}
            >
                Tem certeza que deseja excluir este produto? Esta ação não pode
                ser desfeita.
            </Dialog>

            <PageHeader
                title="Produtos em Tabela"
                subtitle="Visualização tabular para consulta de nome, SKU e descrição."
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
                                name: "Produtos em Tabela",
                                href: "/admin/products/list",
                                current: true,
                            },
                        ]}
                    />
                }
                actions={
                    <Can requiredPermissions={[PERMISSIONS.PRODUCT.CREATE]}>
                        <Button
                            icon={<PlusIcon className="h-4 w-4" />}
                            onClick={() => router.push("/admin/products/create")}
                        >
                            Novo Produto
                        </Button>
                    </Can>
                }
            />

            <ProductFilter filters={filters} updateFilters={updateFilters} />

            {isLoading ? (
                <TableSkeleton />
            ) : (
                <>
                    {/* Table Card */}
                    <DataTableContainer className="mt-6">
                        <div className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-heading text-[17px] font-semibold text-text-primary">
                                        Tabela de Produtos
                                    </h3>
                                    <p className="text-xs text-text-muted">
                                        Lista tabular com colunas Nome, SKU e
                                        Descrição.
                                    </p>
                                </div>
                                <span className="rounded-full border border-border-input bg-bg-input px-3 py-2 text-xs text-text-secondary">
                                    Ordenação visual
                                </span>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-border-card bg-bg-card-hover/50">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeaderCell
                                                scope="col"
                                                className="w-65"
                                            >
                                                Nome
                                            </TableHeaderCell>
                                            <TableHeaderCell
                                                scope="col"
                                                className="w-45"
                                            >
                                                SKU
                                            </TableHeaderCell>
                                            <TableHeaderCell scope="col">
                                                Descrição
                                            </TableHeaderCell>
                                            <TableHeaderCell scope="col">
                                                Preço
                                            </TableHeaderCell>
                                            <Can
                                                requiredPermissions={[
                                                    PERMISSIONS.PRODUCT.UPDATE,
                                                ]}
                                            >
                                                <TableHeaderCell scope="col">
                                                    <span className="sr-only">
                                                        Editar
                                                    </span>
                                                </TableHeaderCell>
                                            </Can>
                                            <Can
                                                requiredPermissions={[
                                                    PERMISSIONS.PRODUCT.DELETE,
                                                ]}
                                            >
                                                <TableHeaderCell scope="col">
                                                    <span className="sr-only">
                                                        Excluir
                                                    </span>
                                                </TableHeaderCell>
                                            </Can>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="w-65">
                                                    {truncateText(
                                                        product.name,
                                                        65,
                                                        {
                                                            removeMarkdown: true,
                                                        },
                                                    )}
                                                </TableCell>
                                                <TableCell className="w-45">
                                                    {product.sku}
                                                </TableCell>
                                                <TableCell>
                                                    {truncateText(
                                                        product.description,
                                                        60,
                                                        {
                                                            removeMarkdown: true,
                                                        },
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {product.formattedPrice ??
                                                        product.price}
                                                </TableCell>
                                                <Can
                                                    requiredPermissions={[
                                                        PERMISSIONS.PRODUCT
                                                            .UPDATE,
                                                    ]}
                                                >
                                                    <TableAction>
                                                        <Link
                                                            href={`/admin/products/edit/${product.alias}`}
                                                            className="text-text-secondary transition-colors hover:text-text-primary"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                            <span className="sr-only">
                                                                , {product.name}
                                                            </span>
                                                        </Link>
                                                    </TableAction>
                                                </Can>
                                                <Can
                                                    requiredPermissions={[
                                                        PERMISSIONS.PRODUCT
                                                            .DELETE,
                                                    ]}
                                                >
                                                    <TableAction>
                                                        <button
                                                            className="text-status-error transition-colors hover:opacity-80"
                                                            onClick={() => {
                                                                if (
                                                                    product.id
                                                                ) {
                                                                    openDeleteDialog(
                                                                        product.id,
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                            <span className="sr-only">
                                                                , {product.name}
                                                            </span>
                                                        </button>
                                                    </TableAction>
                                                </Can>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-xs text-text-muted">
                                    Mostrando {products.length} de {totalItems}{" "}
                                    produtos
                                </span>
                                <PaginationControls
                                    page={filters.page ?? 1}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    totalLabel="produtos"
                                    onPageChange={goToPage}
                                />
                            </div>
                        </div>
                    </DataTableContainer>

                </>
            )}
        </>
    );
}
