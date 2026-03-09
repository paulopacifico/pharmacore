"use client";
import {
    Breadcrumb,
    Button,
    getErrorMessage,
    ItemNotFound,
    Loading,
    PageHeader,
} from "@pharmacore/shared-web";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductCommand, UpdateProductFormData } from "../../../data";
import { ProductForm } from "../../../components";
import { EyeIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { PERMISSIONS } from "@pharmacore/auth";
import { useProductByAlias } from "../../../data";
export function UpdateProductPage({ productAlias }: { productAlias: string }) {
    const { updateProduct } = useProductCommand();
    const { findProductByAlias } = useProductByAlias();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);
    const [initialFormData, setInitialFormData] = useState<
        UpdateProductFormData | undefined
    >();

    useEffect(() => {
        async function fetchProduct() {
            try {
                setIsLoadingProduct(true);
                const fetchedProduct = await findProductByAlias(productAlias);
                if (!fetchedProduct) {
                    throw new Error();
                }
                setProduct(fetchedProduct);
                setInitialFormData({
                    name: fetchedProduct.name ?? "",
                    description: fetchedProduct.description ?? "",
                    price: fetchedProduct.price ?? 0,
                    sku: fetchedProduct.sku ?? "",
                    imagesURL: fetchedProduct.imagesURL ?? [""],
                    brand: fetchedProduct.brand,
                    category: fetchedProduct.category,
                    subcategory: fetchedProduct.subcategory,
                    alias: fetchedProduct.alias ?? "",
                    characteristics: fetchedProduct.characteristics ?? [],
                });
            } catch (error) {
                toast.error("Erro ao carregar produto", {
                    description: getErrorMessage(error),
                });
                router.push("/admin/products/list");
            } finally {
                setIsLoadingProduct(false);
            }
        }
        fetchProduct();
    }, [productAlias, findProductByAlias]);

    async function handleSubmit(data: UpdateProductFormData) {
        try {
            if (!product) {
                throw new Error();
            }
            await updateProduct(product, {
                name: data.name,
                description: data.description,
                price: data.price,
                sku: data.sku,
                imagesURL: data.imagesURL?.filter((url) => url.trim()) || [],
                category: data.category,
                subcategory: data.subcategory,
                brand: data.brand,
                alias: data.alias,
                characteristics: data.characteristics,
            });
            toast.success("Produto atualizado com sucesso");
            router.push("/admin/products/list");
        } catch (error) {
            toast.error("Erro ao atualizar produto", {
                description: getErrorMessage(error),
            });
        }
    }

    if (isLoadingProduct) {
        return <Loading />;
    }

    if (!product) {
        return (
            <ItemNotFound
                icon={ShoppingCartIcon}
                title="Produto Não Encontrado"
                description="Produto não encontrado, por favor verifique o id do produto."
            />
        );
    }

    return (
        <div>
            <PageHeader
                title="Editar Produto"
                subtitle="Preencha o formulário abaixo para editar os dados do produto."
                breadcrumb={
                    <Breadcrumb
                        items={[
                            {
                                name: "Início",
                                href: "/dashboard",
                                current: false,
                            },
                            {
                                name: "Produtos",
                                href: "/admin/products",
                                current: false,
                            },
                            { name: "Editar", href: "#", current: true },
                        ]}
                    />
                }
                actions={
                    <>
                        <Button
                            variant="secondary"
                            icon={<EyeIcon className="h-4 w-4" />}
                        >
                            Visualizar
                        </Button>
                        <Button>Salvar rascunho</Button>
                    </>
                }
                className="mx-10"
            />

            <ProductForm
                onSubmit={handleSubmit}
                onCancel={() => router.push("/admin/products/list")}
                initialData={initialFormData}
                submitButtonText="Salvar Alterações"
                savePermission={PERMISSIONS.PRODUCT.UPDATE}
            />
        </div>
    );
}
