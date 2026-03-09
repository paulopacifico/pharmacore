"use client";
import { useCallback, useEffect, useState } from "react";
import { ProductListItem } from "@pharmacore/product";
import { findManyProductsWithFilter as apiFindManyProductsWithFilter } from "../../api/product.service";
import { useProductFilter } from "./use-product-filter.hook";

export function useProductPagination() {
    const { filters, updateFilters, resetPage } = useProductFilter();
    const [products, setProducts] = useState<ProductListItem[] | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);

    useEffect(() => {
        resetPage();
    }, [filters.categoryId, filters.subcategoryId, filters.search, resetPage]);

    useEffect(() => {
        findManyProducts({ ...filters });
    }, [
        filters.categoryId,
        filters.subcategoryId,
        filters.search,
        filters.page,
    ]);

    const findManyProducts = useCallback(async (searchFilters: any) => {
        try {
            setIsLoading(true);
            const productsResponse =
                await apiFindManyProductsWithFilter(searchFilters);
            setProducts(productsResponse.data);
            setTotalPages(productsResponse.meta.totalPages);
            setTotalItems(productsResponse.meta.total);
        } catch (err) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const goToPage = useCallback(
        (nextPage: number) => {
            const maxPage = totalPages > 0 ? totalPages : 1;
            const safePage = Math.min(
                Math.max(1, Math.floor(nextPage)),
                maxPage,
            );
            if (safePage !== filters.page) {
                updateFilters({ page: safePage });
            }
        },
        [filters.page, totalPages, updateFilters],
    );

    const refreshCurrentPage = useCallback(() => {
        findManyProducts({ ...filters });
    }, [filters, findManyProducts]);

    return {
        products,
        isLoading,
        filters,
        page: filters.page,
        totalPages,
        totalItems,
        updateFilters,
        goToPage,
        refreshCurrentPage,
    };
}
