"use client";
import { getErrorMessage, PageTitle } from "@pharmacore/shared-web";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryForm } from "../../category";
import { useCategory, CreateCategoryFormData } from "../../../data";
import { PERMISSIONS } from "@pharmacore/auth";

export function CreateCategoryPage() {
    const router = useRouter();
    const { createCategory } = useCategory();

    async function handleSubmit(data: CreateCategoryFormData) {
        try {
            await createCategory(data);
            toast.success("Categoria criada com sucesso");
            router.push("/admin/products/categories");
        } catch (error) {
            toast.error("Erro ao criar categoria", {
                description: getErrorMessage(error),
            });
        }
    }

    return (
        <div>
            <PageTitle
                title="Criar Categoria"
                subtitle="Preencha o formulário abaixo para criar uma nova categoria."
                className="mx-4 sm:mx-10"
            />
            <CategoryForm
                onSubmit={handleSubmit}
                onCancel={() => router.push("/admin/products/categories")}
                submitButtonText="Criar Categoria"
                savePermission={PERMISSIONS.PRODUCT.CATEGORY.CREATE}
            />
        </div>
    );
}
