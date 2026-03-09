"use client";
import { useState } from "react";
import { useBrands } from "../../../data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { BrandFilter } from "../../brand";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";

export function BrandListPage() {
    const router = useRouter();
    const {
        isLoadingBrands,
        brands,
        deleteBrand,
        totalPages,
        totalItems,
        goToPage,
        filters,
        updateFilters,
    } = useBrands();
    const [brandToDelete, setBrandToDelete] = useState<string | null>(null);

    function openDeleteDialog(id: string) {
        setBrandToDelete(id);
    }

    async function handleDelete() {
        if (!brandToDelete) return;
        try {
            await deleteBrand(brandToDelete);
            toast.success("Marca excluída com sucesso");
        } catch (error) {
            toast.error("Erro ao excluir a marca.", {
                description: getErrorMessage(error),
            });
        } finally {
            setBrandToDelete(null);
        }
    }

    return (
        <>
            <Dialog
                isOpen={Boolean(brandToDelete)}
                type="delete"
                title="Excluir Marca"
                onClose={() => setBrandToDelete(null)}
                onConfirm={handleDelete}
            >
                Tem certeza que deseja excluir esta marca? Esta ação não pode
                ser desfeita.
            </Dialog>

            <PageHeader
                title="Marcas"
                subtitle="Lista de marcas cadastradas, prontas para edição."
                actions={
                    <Can
                        requiredPermissions={[PERMISSIONS.PRODUCT.CREATE]}
                    >
                        <Button
                            icon={<PlusIcon className="h-4 w-4" />}
                            onClick={() => router.push("/admin/products/brands/create")}
                        >
                            Adicionar marca
                        </Button>
                    </Can>
                }
            />

            <div className="mt-6">
                <BrandFilter filters={filters} updateFilters={updateFilters} />
            </div>

            {isLoadingBrands ? (
                <TableSkeleton />
            ) : (
                <Can requiredPermissions={[PERMISSIONS.PRODUCT.READ]}>
                    <DataTableContainer className="mt-6">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell scope="col">
                                        Nome
                                    </TableHeaderCell>
                                    <TableHeaderCell scope="col">
                                        Alias
                                    </TableHeaderCell>
                                    <Can
                                        requiredPermissions={[
                                            PERMISSIONS.PRODUCT.BRAND.UPDATE,
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
                                            PERMISSIONS.PRODUCT.BRAND.DELETE,
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
                                {brands.map((brand: any) => (
                                    <TableRow key={brand.id}>
                                        <TableCell>{brand.name}</TableCell>
                                        <TableCell>{brand.alias}</TableCell>
                                        <Can
                                            requiredPermissions={[
                                                PERMISSIONS.PRODUCT
                                                    .UPDATE,
                                            ]}
                                        >
                                            <TableAction>
                                                <Link
                                                    href={`/admin/products/brands/edit/${brand.id}`}
                                                    className="inline-flex items-center gap-1.5 text-text-secondary transition-colors hover:text-text-primary"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                    Editar{" "}
                                                    <span className="sr-only">
                                                        , {brand.name}
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
                                                    className="inline-flex items-center gap-1.5 text-status-error transition-colors hover:opacity-80"
                                                    onClick={() =>
                                                        openDeleteDialog(
                                                            brand.id,
                                                        )
                                                    }
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                    Excluir{" "}
                                                    <span className="sr-only">
                                                        , {brand.name}
                                                    </span>
                                                </button>
                                            </TableAction>
                                        </Can>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DataTableContainer>

                    <PaginationControls
                        page={filters.page ?? 1}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        totalLabel="marcas"
                        onPageChange={goToPage}
                    />
                </Can>
            )}
        </>
    );
}
