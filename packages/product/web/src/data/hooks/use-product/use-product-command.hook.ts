"use client";
import { useCallback } from "react";
import {
    createProduct as apiCreateProduct,
    updateProduct as apiUpdateProduct,
    deleteProduct as apiDeleteProduct,
} from "../../api/product.service";

import { CreateProductFormData, UpdateProductFormData } from "../../schemas";

export function useProductCommand() {
    const createProduct = useCallback(async (data: CreateProductFormData) => {
        try {
            await apiCreateProduct({
                name: data.name,
                description: data.description,
                price: data.price,
                sku: data.sku,
                imagesURL: data.imagesURL?.filter((url) => url.trim()) || [],
                subcategoryId: data.subcategory.id,
                characteristics: data.characteristics,
                alias: data.alias,
                brandId: data.brand.id,
            });
        } catch (err) {
            throw err;
        }
    }, []);

    const updateProduct = useCallback(
        async (id: string, data: Partial<UpdateProductFormData>) => {
            try {
                const formattedData = {
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    sku: data.sku,
                    imagesURL:
                        data.imagesURL?.filter((url) => url.trim()) || [],
                    subcategoryId: data.subcategory?.id,
                    characteristics: data.characteristics,
                    alias: data.alias,
                    brandId: data.brand?.id,
                };
                await apiUpdateProduct(id, formattedData);
            } catch (err) {
                throw err;
            }
        },
        [],
    );

    const deleteProduct = useCallback(async (id: string) => {
        try {
            await apiDeleteProduct(id);
        } catch (err) {
            throw err;
        }
    }, []);

    return {
        createProduct,
        updateProduct,
        deleteProduct,
    };
}
