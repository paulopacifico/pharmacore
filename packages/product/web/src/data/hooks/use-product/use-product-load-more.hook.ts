"use client";
import { ProductListItem, ProductQueryDTO } from "@pharmacore/product";
import { useCallback, useEffect, useState } from "react";
import { findManyProductsWithFilter as apiFindManyProductsWithFilter } from "../../api/product.service";
import { useProductFilter } from "./use-product-filter.hook";

export function useProductLoadMore() {
    const [products, setProducts] = useState<ProductListItem[] | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { filters, updateFilters } = useProductFilter();
    const [foundLastProduct, setFoundLastProduct] = useState<boolean>(false);

    useEffect(() => {
        updateFilters({ page: 1 });
        setProducts([]);
        setFoundLastProduct(false);
        findManyProducts({ ...filters, page: 1 }, true); // true = reset
    }, [filters.categoryId, filters.subcategoryId, filters.search]);

    useEffect(() => {
        if (products.length === 0 && filters.page === 1) {
            findManyProducts({ ...filters, page: 1 }, true);
        }
    }, []);

    const findManyProducts = useCallback(
        async (
            searchFilters: ProductQueryDTO,
            shouldReset = false,
        ) => {
            try {
                setIsLoading(true);
                const productsResponse =
                    await apiFindManyProductsWithFilter(searchFilters);

                if (productsResponse.data.length === 0) {
                    setFoundLastProduct(true);
                }

                if (shouldReset) {
                    setProducts(productsResponse.data);
                } else {
                    setProducts((prevProducts) => [
                        ...prevProducts,
                        ...productsResponse.data,
                    ]);
                }
            } catch (err) {
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const loadMore = useCallback(async () => {
        if (foundLastProduct || isLoading) return;

        const nextPage = filters.page! + 1;
        updateFilters({ page: nextPage });
        await findManyProducts({ ...filters, page: nextPage }, false); // false = append
    }, [filters, filters.page, foundLastProduct, isLoading, findManyProducts]);

    return {
        products,
        isLoading,
        loadMore,
        foundLastProduct,
        filters,
        updateFilters,
    };
}
