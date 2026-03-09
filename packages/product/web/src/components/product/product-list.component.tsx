import Link from "next/link";
import { truncateText } from "../../utils";
import { ProductListItem } from "@pharmacore/product";
import { Button, Loading } from "@pharmacore/shared-web";

interface ProductListProps {
    products: ProductListItem[];
    loadMore: () => Promise<void>;
    isLoading: boolean;
    foundLastProduct: boolean;
}

export function ProductList({
    products,
    loadMore,
    isLoading,
    foundLastProduct,
}: ProductListProps) {
    const handleLoadMore = async () => {
        await loadMore();
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/admin/products/details/${product.alias}`}
                        className="group flex flex-col overflow-hidden rounded-xl border border-border-card bg-bg-card transition-colors hover:border-border-strong hover:bg-bg-card-hover"
                    >
                        <div className="flex h-[180px] w-full items-center justify-center rounded-t-xl border-b border-border-card bg-white p-3">
                            <img
                                src={product.imagesURL[0]}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 p-3.5">
                            <h3 className="font-heading text-sm font-bold text-text-primary">
                                {product.name}
                            </h3>
                            <p className="text-[11px] leading-[1.35] text-text-secondary">
                                {truncateText(product.description, 120, {
                                    removeMarkdown: true,
                                })}
                            </p>
                            <div className="flex flex-col gap-1 pt-1 sm:flex-row sm:items-center sm:justify-between">
                                <span className="font-heading text-[13px] font-bold text-accent-cyan">
                                    {product.formattedPrice ?? product.price}
                                </span>
                                <span className="text-[11px] font-semibold text-text-muted">
                                    Estoque: —
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {products.length > 0 && !foundLastProduct && (
                <div className="flex justify-center pt-1.5">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleLoadMore}
                        disabled={isLoading}
                    >
                        {isLoading ? "Carregando..." : "Carregar mais"}
                    </Button>
                </div>
            )}
        </div>
    );
}
