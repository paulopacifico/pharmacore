"use client";

import {
    Breadcrumb,
    PageHeader,
    Loading,
    ItemNotFound,
    Badge,
    Dialog,
    getErrorMessage,
    toast,
} from "@pharmacore/shared-web";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBranch } from "../../data";
import { BranchDetailsDTO } from "@pharmacore/branch";
import { Cnpj, DateVO } from "@pharmacore/shared";
import {
    BuildingOfficeIcon,
    PencilIcon,
    TrashIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";
import Link from "next/link";

interface BranchDetailsPageProps {
    branchId: string;
}

export function BranchDetailsPage({ branchId }: BranchDetailsPageProps) {
    const { getById, del } = useBranch();
    const router = useRouter();
    const [branch, setBranch] = useState<BranchDetailsDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        async function fetchBranch() {
            try {
                setIsLoading(true);
                const fetched = await getById(branchId);
                setBranch(fetched);
            } catch (error) {
                console.error("Failed to fetch branch:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBranch();
    }, [branchId, getById]);

    async function handleDelete() {
        try {
            await del(branchId);
            toast.success("Filial excluída com sucesso");
            router.push("/admin/branches/list");
        } catch (error) {
            toast.error("Erro ao excluir filial", {
                description: getErrorMessage(error),
            });
        } finally {
            setShowDeleteDialog(false);
        }
    }

    if (isLoading) {
        return <Loading />;
    }

    if (!branch) {
        return (
            <ItemNotFound
                icon={BuildingOfficeIcon}
                title="Filial Não Encontrada"
                description="A filial solicitada não foi encontrada. Verifique o ID e tente novamente."
            />
        );
    }

    const address = branch.address;

    return (
        <Can requiredPermissions={[PERMISSIONS.BRANCH.READ]}>
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Detalhes da Filial"
                    subtitle="Informações completas da filial selecionada."
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
                                    current: false,
                                },
                                {
                                    name: "Detalhes",
                                    href: `/admin/branches/details/${branchId}`,
                                    current: true,
                                },
                            ]}
                        />
                    }
                    actions={
                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin/branches/list"
                                className="flex items-center gap-2 rounded-lg bg-bg-card border border-[#3C4450] px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:border-[#5A6477] transition-colors"
                            >
                                <ArrowLeftIcon className="size-4" />
                                Voltar
                            </Link>
                            <Can
                                requiredPermissions={[
                                    PERMISSIONS.BRANCH.UPDATE,
                                ]}
                            >
                                <Link
                                    href={`/admin/branches/edit/${branchId}`}
                                    className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-[13px] font-medium text-white hover:bg-indigo-400 transition-colors"
                                >
                                    <PencilIcon className="size-4" />
                                    Editar
                                </Link>
                            </Can>
                            <Can
                                requiredPermissions={[
                                    PERMISSIONS.BRANCH.DELETE,
                                ]}
                            >
                                <button
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-[13px] font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                                >
                                    <TrashIcon className="size-4" />
                                    Excluir
                                </button>
                            </Can>
                        </div>
                    }
                />

                {/* Main Card */}
                <div className="rounded-[14px] border border-[#3C4450] bg-bg-card p-5 sm:p-6">
                    {/* Header with name + status */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <h2 className="font-heading text-xl font-bold text-text-primary">
                            {branch.name}
                        </h2>
                        <Badge
                            size="sm"
                            variant={
                                branch.isActive ? "success" : "secondary"
                            }
                        >
                            {branch.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                    </div>

                    {/* Info Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        <InfoItem
                            label="CNPJ"
                            value={Cnpj.format(branch.cnpj)}
                        />
                        <InfoItem
                            label="Data de Inauguração"
                            value={DateVO.format(branch.establishedAt)}
                        />
                        <InfoItem
                            label="Data de Criação"
                            value={DateVO.format(branch.createdAt)}
                        />
                    </div>

                    {/* Address Section */}
                    <div className="border-t border-[#3C4450] pt-6">
                        <h3 className="font-heading text-base font-semibold text-text-primary mb-4">
                            Endereço
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <InfoItem label="Rua" value={address.street} />
                            <InfoItem label="Número" value={address.number} />
                            <InfoItem
                                label="Complemento"
                                value={address.complement || "—"}
                            />
                            <InfoItem
                                label="Bairro"
                                value={address.neighborhood}
                            />
                            <InfoItem
                                label="Cidade / UF"
                                value={`${address.city} / ${address.state}`}
                            />
                            <InfoItem label="CEP" value={address.zip} />
                            <InfoItem label="País" value={address.country} />
                        </div>
                    </div>
                </div>

                <Can requiredPermissions={[PERMISSIONS.BRANCH.DELETE]}>
                    <Dialog
                        isOpen={showDeleteDialog}
                        type="delete"
                        title="Excluir Filial"
                        onClose={() => setShowDeleteDialog(false)}
                        onConfirm={handleDelete}
                    >
                        Tem certeza que deseja excluir a filial{" "}
                        <strong>{branch.name}</strong>? Esta ação não pode ser
                        desfeita.
                    </Dialog>
                </Can>
            </div>
        </Can>
    );
}

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                {label}
            </span>
            <span className="text-[14px] font-medium text-text-primary">
                {value || "—"}
            </span>
        </div>
    );
}
