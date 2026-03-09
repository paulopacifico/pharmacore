"use client";
import {
    Breadcrumb,
    Button,
    DataTableContainer,
    Loading,
    PageHeader,
} from "@pharmacore/shared-web";
import { useProductLoadMore } from "../../data";
import { ProductFilter, ProductList } from "../product";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";

export function Catalog() {
    const router = useRouter();
    const {
        filters,
        foundLastProduct,
        isLoading,
        loadMore,
        products,
        updateFilters,
    } = useProductLoadMore();

    if (!products) {
        return <Loading />;
    }

    return (
        <Can requiredPermissions={[PERMISSIONS.PRODUCT.READ]}>
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Catálogo de Produtos"
                    subtitle="Navegue pelo catálogo completo de produtos com fotos, descrição e estoque."
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
                                    current: true,
                                },
                            ]}
                        />
                    }
                    actions={
                        <Can requiredPermissions={[PERMISSIONS.PRODUCT.CREATE]}>
                            <Button
                                icon={<PlusIcon className="h-4 w-4" />}
                                onClick={() => router.push("/admin/products/create")}
                            >
                                Novo Produto
                            </Button>
                        </Can>
                    }
                />

                {/* Filters Card */}
                <DataTableContainer>
                    <div className="p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-heading text-[17px] font-semibold text-text-primary">
                                Busca e Filtros
                            </h3>
                            <p className="text-xs text-text-muted">
                                Filtre por categoria, subcategoria e termo de
                                busca para localizar produtos rapidamente.
                            </p>
                        </div>
                        <ProductFilter
                            filters={filters}
                            updateFilters={updateFilters}
                        />
                        <p className="text-[11px] text-text-muted">
                            Subcategoria é dependente da categoria quando
                            aplicável.
                        </p>
                    </div>
                </DataTableContainer>

                {/* Catalog Card */}
                <DataTableContainer>
                    <div className="p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-heading text-base font-bold text-text-primary">
                                Catálogo de Produtos
                            </h3>
                            <p className="text-xs text-text-muted">
                                Lista em cards com foto, descrição resumida e
                                informações essenciais.
                            </p>
                        </div>

                        <ProductList
                            products={products}
                            loadMore={loadMore}
                            isLoading={isLoading}
                            foundLastProduct={foundLastProduct}
                        />

                        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-[11px] font-semibold text-text-muted">
                                {products.length} produtos em destaque no
                                catálogo visual
                            </span>
                            <span className="text-[11px] font-bold text-accent-blue">
                                Atualizado agora
                            </span>
                        </div>
                    </div>
                </DataTableContainer>
            </div>
        </Can>
    );
}
