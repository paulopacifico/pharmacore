"use client";
import {
    getErrorMessage,
    ItemNotFound,
    Loading,
    PageTitle,
} from "@pharmacore/shared-web";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BrandForm } from "../../brand";
import { useBrands, UpdateBrandFormData } from "../../../data";
import { useEffect, useState } from "react";
import { TagIcon } from "@heroicons/react/24/outline";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";

interface UpdateBrandPageProps {
    brandId: string;
}

export function UpdateBrandPage({ brandId }: UpdateBrandPageProps) {
    const router = useRouter();
    const { findBrandById, updateBrand } = useBrands();
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState<UpdateBrandFormData | null>(
        null,
    );

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const brand = await findBrandById(brandId);

                if (!brand) {
                    throw new Error();
                }

                setInitialData({
                    name: brand.name,
                    alias: brand.alias,
                });
            } catch (error) {
                toast.error("Erro ao carregar marca", {
                    description: getErrorMessage(error),
                });
            } finally {
                setIsLoading(false);
            }
        })();
    }, [brandId, findBrandById]);

    async function handleSubmit(data: UpdateBrandFormData) {
        try {
            await updateBrand(brandId, data);
            toast.success("Marca atualizada com sucesso");
            router.push("/admin/products/brands");
        } catch (error) {
            toast.error("Erro ao atualizar marca", {
                description: getErrorMessage(error),
            });
        }
    }

    if (isLoading) {
        return <Loading />;
    }

    if (!initialData) {
        return (
            <ItemNotFound
                title="Marca não encontrada"
                description="A marca solicitada não foi encontrada."
                icon={TagIcon}
            />
        );
    }

    return (
        <div>
            <PageTitle
                title="Editar Marca"
                subtitle="Atualize as informações da marca."
                className="mx-4 sm:mx-10"
            />
            <BrandForm
                onSubmit={handleSubmit}
                onCancel={() => router.push("/admin/products/brands")}
                submitButtonText="Atualizar Marca"
                initialData={initialData}
                savePermission={PERMISSIONS.PRODUCT.UPDATE}
            />
        </div>
    );
}
