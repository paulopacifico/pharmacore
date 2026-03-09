"use client";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    findAllCategories as apiFindAllCategories,
    deleteCategory as apiDeleteCategory,
    createCategory as apiCreateCategory,
    updateCategory as apiUpdateCategory,
} from "../api/category.service";
import {
    Category,
    CategoryDetailsDTO,
    CategoryListDTO,
    SubcategoryListDTO,
} from "@pharmacore/product";
import { CreateCategoryFormData, UpdateCategoryFormData } from "../schemas";

export interface CategoryContextProps {
    categories: CategoryListDTO | [];
    isLoadingCategories: boolean;
    findAllCategories(getSubcategories?: boolean): Promise<void>;
    findSubcategoriesByCategoryId(
        categoryId: string,
    ): Promise<SubcategoryListDTO>;
    deleteCategory(id: string): Promise<void>;
    findCategoryById(id: string): Promise<CategoryDetailsDTO | null>;
    createCategory(data: CreateCategoryFormData): Promise<void>;
    updateCategory(id: string, data: UpdateCategoryFormData): Promise<void>;
}

export const CategoryContext = createContext<CategoryContextProps>(
    {} as CategoryContextProps,
);

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<CategoryListDTO | []>([]);
    const [isLoadingCategories, setIsLoadingCategories] =
        useState<boolean>(false);

    useEffect(() => {
        findAllCategories(true);
    }, []);

    const findAllCategories = useCallback(async (getSubcategories = false) => {
        try {
            setIsLoadingCategories(true);
            const categoriesResponse = await apiFindAllCategories({
                getSubcategories,
            });
            setCategories(categoriesResponse);
        } catch (err) {
            throw err;
        } finally {
            setIsLoadingCategories(false);
        }
    }, []);

    const findCategoryById = useCallback(
        async (id: string) => {
            if (!categories || categories.length === 0) {
                await findAllCategories(true);
            }
            const category = categories.find((category) => category.id === id);
            return category ?? null;
        },
        [categories, findAllCategories],
    );

    const findSubcategoriesByCategoryId = useCallback(
        async (categoryId: string) => {
            const category = categories.find(
                (category: any) => category.id === categoryId,
            );
            return category?.subcategories || [];
        },
        [categories],
    );

    const deleteCategory = useCallback(
        async (id: string) => {
            try {
                await apiDeleteCategory(id);
                await findAllCategories(true);
            } catch (err) {
                throw err;
            }
        },
        [findAllCategories],
    );

    const createCategory = useCallback(
        async (data: CreateCategoryFormData) => {
            try {
                await apiCreateCategory(data);
                await findAllCategories(true);
            } catch (err) {
                throw err;
            }
        },
        [findAllCategories],
    );

    const updateCategory = useCallback(
        async (id: string, data: UpdateCategoryFormData) => {
            try {
                const formattedData = {
                    id,
                    name: data.name,
                    alias: data.alias!,
                    subcategories: data.subcategories.map((subcat) => ({
                        id: subcat.id,
                        name: subcat.name,
                        alias: subcat.alias!,
                    })),
                };

                await apiUpdateCategory(id, formattedData);
                await findAllCategories(true);
            } catch (err) {
                throw err;
            }
        },
        [findAllCategories],
    );

    return (
        <CategoryContext.Provider
            value={{
                categories,
                isLoadingCategories,
                findAllCategories,
                findSubcategoriesByCategoryId,
                deleteCategory,
                findCategoryById,
                createCategory,
                updateCategory,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
}
