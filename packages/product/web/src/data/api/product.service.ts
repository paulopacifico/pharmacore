import { api } from "@pharmacore/shared-web";
import {
    ProductListDTO,
    ProductDetailsDTO,
    ProductStatusDTO,
    ProductQueryDTO,
    CreateProductIn,
    UpdateProductIn,
} from "@pharmacore/product";

export async function findAllProducts(): Promise<ProductListDTO> {
    const response = await api.get<ProductListDTO>("/products");
    return response.data;
}

export async function createProduct(data: CreateProductIn): Promise<void> {
    await api.post<void>("/products", data);
}

export async function findProductByAlias(alias: string) {
    const response = await api.get<ProductDetailsDTO>(`/products/${alias}`);
    return response.data;
}

export async function updateProduct(
    id: string,
    data: Partial<UpdateProductIn>,
): Promise<void> {
    await api.patch<void>(`/products/${id}`, data);
}

export async function deleteProduct(id: string): Promise<void> {
    await api.delete<void>(`/products/${id}`);
}

export async function findManyProductsWithFilter(
    filters: ProductQueryDTO,
): Promise<ProductListDTO> {
    const response = await api.get<ProductListDTO>("/products", {
        params: filters,
    });
    return response.data;
}

export async function findStats(): Promise<ProductStatusDTO> {
    const response = await api.get<ProductStatusDTO>("/products/status");
    return response.data;
}
