"use client";
import { getErrorMessage, PageTitle } from "@pharmacore/shared-web";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProductCommand, CreateProductFormData } from "../../../data";
import { ProductForm } from "../../../components";
import { PERMISSIONS } from "@pharmacore/auth";

export function CreateProductPage() {
    const router = useRouter();
    const { createProduct } = useProductCommand();

    async function handleSubmit(data: CreateProductFormData) {
        try {
            await createProduct({
                name: data.name,
                description: data.description,
                alias: data.alias,
                price: data.price,
                sku: data.sku,
                imagesURL: data.imagesURL?.filter((url) => url.trim()) || [],
                category: data.category,
                subcategory: data.subcategory,
                brand: data.brand,
                characteristics: data.characteristics,
            } as any);
            toast.success("Produto criado com sucesso");
            router.push("/admin/products/list");
        } catch (error) {
            toast.error("Erro ao criar produto", {
                description: getErrorMessage(error),
            });
        }
    }

    return (
        <div>
            <PageTitle
                title="Criar Produto"
                subtitle="Preencha o formulário abaixo para criar um novo produto."
                className="mx-4 sm:mx-10"
            />

            <ProductForm
                onSubmit={handleSubmit}
                onCancel={() => router.push("/admin/products/list")}
                submitButtonText="Criar Produto"
                savePermission={PERMISSIONS.PRODUCT.CREATE}
            />
        </div>
    );
}
