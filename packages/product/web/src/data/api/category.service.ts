import { CreateCategoryIn, UpdateCategoryIn } from "@pharmacore/product";
import { api } from "@pharmacore/shared-web";

export async function findAllCategories({
    getSubcategories,
}: { getSubcategories?: boolean } = {}): Promise<any> {
    const response = await api.get<any>(
        `/categories${getSubcategories ? "?getSubcategories=true" : ""}`,
    );
    return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
}

export async function findCategoryById(id: string): Promise<any> {
    const response = await api.get<any>(`/categories/${id}`);
    return response.data;
}

export async function createCategory(data: CreateCategoryIn): Promise<void> {
    await api.post("/categories", data);
}

export async function updateCategory(
    id: string,
    data: Partial<UpdateCategoryIn>,
): Promise<void> {
    await api.patch(`/categories/${id}`, data);
}
