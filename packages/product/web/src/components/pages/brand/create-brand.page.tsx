"use client";
import { getErrorMessage, PageTitle } from "@pharmacore/shared-web";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BrandForm } from "../../brand";
import { useBrands, CreateBrandFormData } from "../../../data";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";

export function CreateBrandPage() {
    const router = useRouter();
    const { createBrand } = useBrands();

    async function handleSubmit(data: CreateBrandFormData) {
        try {
            await createBrand(data);
            toast.success("Marca criada com sucesso");
            router.push("/admin/products/brands");
        } catch (error) {
            toast.error("Erro ao criar marca", {
                description: getErrorMessage(error),
            });
        }
    }

    return (
        <div>
            <PageTitle
                title="Criar Marca"
                subtitle="Preencha o formulário abaixo para criar uma nova marca."
                className="mx-4 sm:mx-10"
            />
            <BrandForm
                onSubmit={handleSubmit}
                onCancel={() => router.push("/admin/products/brands")}
                submitButtonText="Criar Marca"
                savePermission={PERMISSIONS.PRODUCT.CREATE}
            />
        </div>
    );
}
