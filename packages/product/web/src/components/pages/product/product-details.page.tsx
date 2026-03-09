"use client";

import { useEffect, useState } from "react";
import { useProductByAlias } from "../../../data";
import { ProductDetailsDTO } from "@pharmacore/product";
import {
    Breadcrumb,
    Loading,
    PageHeader,
    Button,
} from "@pharmacore/shared-web";
import { ProductImageGallery } from "../../../components";
import ReactMarkdown from "react-markdown";
import {
    TagIcon,
    Squares2X2Icon,
    BuildingStorefrontIcon,
    IdentificationIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface ProductDetailsPageProps {
    productAlias: string;
    actions?: React.ReactNode;
}

export function ProductDetailsPage({
    productAlias,
    actions: actionsProp,
}: ProductDetailsPageProps) {
    const [product, setProduct] = useState<ProductDetailsDTO | null>(null);
    const { findProductByAlias } = useProductByAlias();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const product = await findProductByAlias(productAlias);
            setProduct(product);
        })();
    }, [productAlias, findProductByAlias]);

    if (!product) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col gap-2">
            <PageHeader
                title={product.name}
                subtitle={`SKU: ${product.sku} · ${product.category?.name} / ${product.subcategory?.name}`}
                breadcrumb={
                    <Breadcrumb
                        items={[
                            {
                                name: "Início",
                                href: "/dashboard",
                                current: false,
                            },
                            {
                                name: "Catálogo",
                                href: "/admin/products/catalog",
                                current: false,
                            },
                            { name: "Detalhes", href: "#", current: true },
                        ]}
                    />
                }
                actions={
                    <Button
                        variant="secondary"
                        icon={<ArrowLeftIcon className="h-4 w-4" />}
                        onClick={() => router.push("/admin/products/catalog")}
                    >
                        Voltar
                    </Button>
                }
            />

            {actionsProp}
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                {/* Left: Sticky image gallery */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <ProductImageGallery images={product.imagesURL} />

                    <div>
                        {product.characteristics &&
                            product.characteristics.length > 0 && (
                                <div className="mt-8 border-t border-border-card pt-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                        {product.characteristics.map(
                                            (characteristic, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start justify-between rounded-lg border border-border-card bg-bg-card-hover p-4"
                                                >
                                                    <div className="flex-1">
                                                        <span className="text-sm font-medium text-text-muted">
                                                            {
                                                                characteristic.name
                                                            }
                                                        </span>
                                                        <p className="mt-1 text-base font-semibold text-text-primary">
                                                            {
                                                                characteristic.value
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* Right: Product info */}
                <div className="mt-8 lg:mt-0 flex flex-col gap-6">
                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="font-heading text-3xl font-bold text-accent-cyan">
                            {product.formattedPrice}
                        </span>
                    </div>

                    {/* Highlights card */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-border-card bg-bg-card p-5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                            Informações do Produto
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoItem
                                icon={<Squares2X2Icon className="h-4 w-4" />}
                                label="Categoria"
                                value={product.category?.name}
                            />
                            <InfoItem
                                icon={<TagIcon className="h-4 w-4" />}
                                label="Subcategoria"
                                value={product.subcategory?.name}
                            />
                            <InfoItem
                                icon={
                                    <BuildingStorefrontIcon className="h-4 w-4" />
                                }
                                label="Fabricado por"
                                value={product.brand?.name}
                            />
                            <InfoItem
                                icon={
                                    <IdentificationIcon className="h-4 w-4" />
                                }
                                label="SKU"
                                value={product.sku}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-3 rounded-2xl border border-border-card bg-bg-card p-5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                            Descrição
                        </h3>
                        <div className="prose prose-sm max-w-none [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-text-primary [&_h2]:mt-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text-primary [&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-text-primary [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-text-secondary [&_ul]:text-[13px] [&_ul]:text-text-secondary [&_ol]:text-[13px] [&_ol]:text-text-secondary [&_li]:text-text-secondary [&_strong]:text-text-primary [&_a]:text-accent-blue [&_blockquote]:border-l-accent-blue [&_blockquote]:text-text-muted [&_code]:rounded [&_code]:bg-bg-input [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-accent-cyan [&_hr]:border-border-card">
                            <ReactMarkdown>{product.description}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-bg-input text-accent-blue">
                {icon}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[11px] text-text-muted">{label}</span>
                <span className="truncate text-[13px] font-semibold text-text-primary">
                    {value ?? "—"}
                </span>
            </div>
        </div>
    );
}
