"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Table,
    TableAction,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    TableSkeleton,
    Dialog,
    PaginationControls,
    getErrorMessage,
    Badge,
    toast,
} from "@pharmacore/shared-web";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Address, Cnpj, DateVO } from "@pharmacore/shared";
import { useBranch } from "../../data";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";

export function BranchesTable() {
    const { branches, isLoading, del, page, totalPages, total, goToPage } =
        useBranch();
    const [branchToDelete, setBranchToDelete] = useState<string | null>(null);

    async function handleDelete() {
        if (!branchToDelete) return;

        try {
            await del(branchToDelete);
            setBranchToDelete(null);
            toast.success("Filial excluída com sucesso");
        } catch (error) {
            toast.error("Erro ao excluir a filial", {
                description: getErrorMessage(error),
            });
        } finally {
            setBranchToDelete(null);
        }
    }

    if (isLoading) return <TableSkeleton />;

    return (
        <Can requiredPermissions={[PERMISSIONS.BRANCH.READ]}>
            <div className="mt-2 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell scope="col">
                                        Nome
                                    </TableHeaderCell>
                                    <TableHeaderCell scope="col">
                                        CNPJ
                                    </TableHeaderCell>
                                    <TableHeaderCell scope="col">
                                        Status
                                    </TableHeaderCell>
                                    <TableHeaderCell scope="col">
                                        Cidade
                                    </TableHeaderCell>
                                    <TableHeaderCell scope="col">
                                        Inauguração
                                    </TableHeaderCell>
                                    <TableHeaderCell scope="col">
                                        <span className="sr-only">Ações</span>
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y divide-gray-800">
                                {branches.map((branch) => (
                                    <TableRow key={branch.id}>
                                        <TableCell>
                                            <Link
                                                href={`/admin/branches/details/${branch.id}`}
                                                className="font-medium text-white hover:text-indigo-300 transition-colors"
                                            >
                                                {branch.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {Cnpj.format(branch.cnpj)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                size="sm"
                                                variant={
                                                    branch.isActive
                                                        ? "success"
                                                        : "secondary"
                                                }
                                            >
                                                {branch.isActive
                                                    ? "Ativo"
                                                    : "Inativo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {Address.formatShort(
                                                branch.address,
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {DateVO.format(
                                                branch.establishedAt,
                                            )}
                                        </TableCell>
                                        <TableAction>
                                            <div className="flex gap-2 justify-end items-center">
                                                <Link
                                                    title="Ver detalhes"
                                                    href={`/admin/branches/details/${branch.id}`}
                                                    className="text-cyan-400 hover:text-cyan-300 border border-transparent rounded-md hover:border-cyan-400 transition-all p-1"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                    <span className="sr-only">
                                                        Ver, {branch.name}
                                                    </span>
                                                </Link>
                                                <Can
                                                    requiredPermissions={[
                                                        PERMISSIONS.BRANCH
                                                            .UPDATE,
                                                    ]}
                                                >
                                                    <Link
                                                        title="Editar"
                                                        href={`/admin/branches/edit/${branch.id}`}
                                                        className="text-indigo-400 hover:text-indigo-300 border border-transparent rounded-md hover:border-indigo-400 transition-all p-1"
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                        <span className="sr-only">
                                                            , {branch.name}
                                                        </span>
                                                    </Link>
                                                </Can>
                                                <Can
                                                    requiredPermissions={[
                                                        PERMISSIONS.BRANCH
                                                            .DELETE,
                                                    ]}
                                                >
                                                    <button
                                                        title="Excluir"
                                                        onClick={() =>
                                                            branch.id &&
                                                            setBranchToDelete(
                                                                branch.id,
                                                            )
                                                        }
                                                        className="text-red-400 cursor-pointer border border-transparent rounded-md hover:border-red-400 transition-all p-1 hover:text-red-300"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                        <span className="sr-only">
                                                            , {branch.name}
                                                        </span>
                                                    </button>
                                                </Can>
                                            </div>
                                        </TableAction>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <Can requiredPermissions={[PERMISSIONS.BRANCH.DELETE]}>
                <Dialog
                    isOpen={Boolean(branchToDelete)}
                    type="delete"
                    title="Excluir Filial"
                    onClose={() => setBranchToDelete(null)}
                    onConfirm={handleDelete}
                >
                    Tem certeza que deseja excluir esta filial? Esta ação não
                    pode ser desfeita.
                </Dialog>
            </Can>
            <PaginationControls
                page={page}
                totalPages={totalPages}
                totalItems={total}
                totalLabel="filiais"
                onPageChange={goToPage}
            />
        </Can>
    );
}
