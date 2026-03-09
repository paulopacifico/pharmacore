"use client";

import {
    getErrorMessage,
    ItemNotFound,
    Loading,
    PageTitle,
} from "@pharmacore/shared-web";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBranch } from "../../data";
import { BranchForm } from "../shared";
import { DateVO } from "@pharmacore/shared";
import { BranchFormData } from "../../data/schemas";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";

interface EditBranchPageProps {
    branchId: string;
}

export function EditBranchPage({ branchId }: EditBranchPageProps) {
    const { getById, update } = useBranch();
    const router = useRouter();
    const [branch, setBranch] = useState<any>(null);
    const [isLoadingBranch, setIsLoadingBranch] = useState(true);
    const [initialFormData, setInitialFormData] = useState<
        BranchFormData | undefined
    >();

    useEffect(() => {
        async function fetchBranch() {
            try {
                setIsLoadingBranch(true);
                const fetchedBranch = await getById(branchId);

                if (!fetchedBranch) {
                    throw new Error();
                }
                setBranch(fetchedBranch);

                setInitialFormData({
                    name: fetchedBranch.name ?? "",
                    cnpj: fetchedBranch.cnpj ?? "",
                    isActive: Boolean(fetchedBranch.isActive ?? true),
                    establishedAt: fetchedBranch.establishedAt ?? undefined,
                    address: {
                        street: fetchedBranch.address?.street ?? "",
                        number: fetchedBranch.address?.number ?? "",
                        complement: fetchedBranch.address?.complement ?? "",
                        neighborhood: fetchedBranch.address?.neighborhood ?? "",
                        city: fetchedBranch.address?.city ?? "",
                        state: fetchedBranch.address?.state ?? "",
                        zip: fetchedBranch.address?.zip ?? "",
                        country: fetchedBranch.address?.country ?? "Brasil",
                    },
                });
            } catch (error) {
                toast.error("Erro ao carregar filial", {
                    description: getErrorMessage(error),
                });
                router.push("/admin/branches/list");
            } finally {
                setIsLoadingBranch(false);
            }
        }
        fetchBranch();
    }, [branchId, getById, router]);

    async function handleSubmit(data: BranchFormData) {
        try {
            if (!branchId) {
                throw new Error();
            }

            const address = data.address;
            await update(branchId, {
                name: data.name,
                cnpj: data.cnpj,
                isActive: Boolean(data.isActive),
                establishedAt: DateVO.fromUnknown(data.establishedAt),
                address: {
                    ...address,
                    zip: (address.zip || "").replace(/\D/g, ""),
                },
            });
            toast.success("Filial atualizada com sucesso");
            router.push("/admin/branches/list");
        } catch (error) {
            toast.error("Erro ao atualizar filial", {
                description: getErrorMessage(error),
            });
        }
    }

    if (isLoadingBranch) {
        return <Loading />;
    }

    if (!branch) {
        return (
            <ItemNotFound
                icon={BuildingOfficeIcon}
                title="Filial Não Encontrada"
                description="Filial não encontrada, por favor verifique o id da filial."
            />
        );
    }

    return (
        <div>
            <PageTitle
                title="Editar Filial"
                subtitle="Preencha o formulário abaixo para editar a filial."
                className="mx-8"
            />
            <Can requiredPermissions={[PERMISSIONS.BRANCH.UPDATE]}>
                <BranchForm
                    onSubmit={handleSubmit}
                    onCancel={() => router.push("/admin/branches/list")}
                    initialData={initialFormData}
                    submitButtonText="Salvar Alterações"
                />
            </Can>
        </div>
    );
}
