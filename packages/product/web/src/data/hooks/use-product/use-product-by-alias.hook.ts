"use client";
import { useCallback } from "react";
import { findProductByAlias as apiFindProductByAlias } from "../../api/product.service";

export function useProductByAlias() {
    const findProductByAlias = useCallback(async (alias: string) => {
        try {
            const product = await apiFindProductByAlias(alias);
            return product;
        } catch (err) {
            throw err;
        }
    }, []);

    return {
        findProductByAlias,
    };
}
