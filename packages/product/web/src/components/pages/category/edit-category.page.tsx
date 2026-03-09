"use client";
import {
    getErrorMessage,
    ItemNotFound,
    Loading,
    PageTitle,
} from "@pharmacore/shared-web";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryForm } from "../../../components/category";
import { useCategory, UpdateCategoryFormData } from "../../../data";
import { useEffect, useState } from "react";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { PERMISSIONS } from "@pharmacore/auth";

interface UpdateCategoryPageProps {
    categoryId: string;
}

export function UpdateCategoryPage({ categoryId }: UpdateCategoryPageProps) {
    const router = useRouter();
    const { findCategoryById, updateCategory } = useCategory();
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] =
        useState<UpdateCategoryFormData | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const category = await findCategoryById(categoryId);

                if (!category) {
                    throw new Error();
                }

                const subcategories = category.subcategories
                    ? category.subcategories.map((sub: any) => ({
                          id: sub.id,
                          name: sub.name,
                          alias: sub.alias,
                      }))
                    : [];

                setInitialData({
                    name: category.name,
                    alias: category.alias,
                    subcategories,
                });
            } catch (error) {
                toast.error("Erro ao carregar categoria", {
                    description: getErrorMessage(error),
                });
                router.push("/admin/products/categories");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [categoryId]);

    async function handleSubmit(data: UpdateCategoryFormData) {
        try {
            if (!categoryId) {
                throw new Error();
            }

            await updateCategory(categoryId, data);

            toast.success("Categoria atualizada com sucesso");
            router.push("/admin/products/categories");
        } catch (error) {
            toast.error("Erro ao atualizar categoria", {
                description: getErrorMessage(error),
            });
        }
    }

    if (isLoading) {
        return <Loading />;
    }

    if (!isLoading && !initialData) {
        return (
            <ItemNotFound
                icon={ListBulletIcon}
                title="Categoria Não Encontrada"
                description="Categoria não encontrada, por favor verifique o id da categoria."
            />
        );
    }

    return (
        <div>
            <PageTitle
                title="Editar Categoria"
                subtitle="Preencha o formulário abaixo para editar a categoria."
                className="mx-4 sm:mx-10"
            />
            <CategoryForm
                onSubmit={handleSubmit}
                onCancel={() => router.push("/admin/products/categories")}
                initialData={initialData ?? undefined}
                submitButtonText="Atualizar Categoria"
                savePermission={PERMISSIONS.PRODUCT.CATEGORY.UPDATE}
            />
        </div>
    );
}
