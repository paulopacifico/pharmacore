import { api } from "@pharmacore/shared-web";
import {
    BrandQueryDTO,
    BrandListDTO,
    CreateBrandIn,
    UpdateBrandIn,
} from "@pharmacore/product";

export async function findManyBrandsWithFilter(
    filters: BrandQueryDTO,
): Promise<BrandListDTO> {
    const response = await api.get<BrandListDTO>("/brands", {
        params: filters,
    });
    return response.data;
}

export async function deleteBrand(id: string): Promise<void> {
    await api.delete(`/brands/${id}`);
}

export async function findBrandById(id: string): Promise<any> {
    const response = await api.get<any>(`/brands/${id}`);
    return response.data;
}

export async function createBrand(data: CreateBrandIn): Promise<void> {
    await api.post("/brands", data);
}

export async function updateBrand(
    id: string,
    data: UpdateBrandIn,
): Promise<void> {
    await api.patch(`/brands/${id}`, data);
}
