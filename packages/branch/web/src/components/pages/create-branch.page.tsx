"use client";

import { getErrorMessage, PageTitle } from "@pharmacore/shared-web";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useBranch } from "../../data";
import { BranchForm } from "../shared";
import { DateVO } from "@pharmacore/shared";
import { BranchFormData } from "../../data/schemas";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";

export function CreateBranchPage() {
    const router = useRouter();
    const { create } = useBranch();

    async function handleSubmit(data: BranchFormData) {
        try {
            const address = data.address;
            await create({
                name: data.name,
                cnpj: data.cnpj,
                isActive: Boolean(data.isActive),
                establishedAt: DateVO.fromUnknown(data.establishedAt),
                address: {
                    ...address,
                    zip: (address.zip || "").replace(/\D/g, ""),
                },
            });
            toast.success("Filial criada com sucesso");
            router.push("/admin/branches/list");
        } catch (error) {
            toast.error("Erro ao criar filial", {
                description: getErrorMessage(error),
            });
        }
    }

    return (
        <div>
            <PageTitle
                title="Criar Filial"
                subtitle="Preencha o formulário abaixo para criar uma nova filial."
                className="mx-8"
            />
            <Can requiredPermissions={[PERMISSIONS.BRANCH.CREATE]}>
                <BranchForm
                    onSubmit={handleSubmit}
                    onCancel={() => router.push("/admin/branches/list")}
                    submitButtonText="Criar Filial"
                />
            </Can>
        </div>
    );
}
