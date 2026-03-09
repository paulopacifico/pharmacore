"use client";
import { useCallback, useState } from "react";
import { ProductQueryDTO } from "@pharmacore/product";

export function useProductFilter() {
    const [filters, setFilters] = useState<ProductQueryDTO>({
        categoryId: undefined,
        subcategoryId: undefined,
        search: "",
        page: 1,
        pageSize: 15,
    });

    const updateFilters = useCallback(
        (newFilters: Partial<ProductQueryDTO>) => {
            setFilters((prevFilters) => ({
                ...prevFilters,
                ...newFilters,
            }));
        },
        [],
    );

    const resetFilters = useCallback(() => {
        setFilters({
            categoryId: undefined,
            subcategoryId: undefined,
            search: "",
            page: 1,
            pageSize: 15,
        });
    }, []);

    const resetPage = useCallback(() => {
        updateFilters({ page: 1 });
    }, [updateFilters]);

    return {
        filters,
        updateFilters,
        resetFilters,
        resetPage,
    };
}
