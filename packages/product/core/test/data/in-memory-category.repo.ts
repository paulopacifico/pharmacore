import { Result } from "@pharmacore/shared";
import {
    CategoryErrors,
    Subcategory,
    SubcategoriesList,
    Category,
    CategoryRepository,
    CategoryDetailsDTO,
    CategoryListDTO,
    FindCategoryDetailsByIdQuery,
    FindManyCategoriesQuery,
} from "../../src";

export class InMemoryCategoryRepository implements CategoryRepository {
    private categories: Category[] = [];

    constructor() {
        this.initializeCategories();
    }

    withoutCategories(): void {
        this.categories = [];
    }

    private initializeCategories(): void {
        const subcategory1Props = {
            id: "550e8400-e29b-41d4-a716-446655440101",
            name: "Smartphones",
            alias: "smartphones",
            parentId: "550e8400-e29b-41d4-a716-446655440001",
            order: 0,
        };

        const subcategory2Props = {
            id: "550e8400-e29b-41d4-a716-446655440102",
            name: "Tablets",
            alias: "tablets",
            parentId: "550e8400-e29b-41d4-a716-446655440001",
            order: 1,
        };

        const subcategory3Props = {
            id: "550e8400-e29b-41d4-a716-446655440103",
            name: "Laptops",
            alias: "laptops",
            parentId: "550e8400-e29b-41d4-a716-446655440002",
            order: 0,
        };

        const category1 = Category.create({
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Eletrônicos",
            alias: "eletronicos",
            subcategories: SubcategoriesList.create([subcategory1Props, subcategory2Props]),
        });

        const category2 = Category.create({
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Medicamentos",
            alias: "medicamentos",
            subcategories: SubcategoriesList.create([subcategory3Props]),
        });

        const category3 = Category.create({
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "Cosméticos",
            alias: "cosmeticos",
            subcategories: SubcategoriesList.create([]),
        });

        this.categories = [category1, category2, category3];
    }

    getOneCategoryId(): string {
        return this.categories[0].id;
    }

    async create(entity: Category): Promise<Result<void>> {
        this.categories.push(entity);
        return Result.ok();
    }

    async update(entity: Category): Promise<Result<void>> {
        const index = this.categories.findIndex((c) => c.equals(entity));
        if (index === -1) {
            return Result.fail(CategoryErrors.NOT_FOUND);
        }
        this.categories[index] = entity;
        return Result.ok();
    }

    async findById(id: string): Promise<Result<Category>> {
        const category = this.categories.find((c) => c.id === id);
        if (!category) {
            return Result.fail(CategoryErrors.NOT_FOUND);
        }
        return Result.ok(category);
    }

    async findByIdWithSubcategories(id: string): Promise<Result<Category>> {
        const category = this.categories.find((c) => c.id === id);
        if (!category) {
            return Result.fail(CategoryErrors.NOT_FOUND);
        }
        return Result.ok(category);
    }

    async findByName(name: string): Promise<Result<Category>> {
        const category = this.categories.find((c) => c.name === name);
        if (!category) {
            return Result.fail(CategoryErrors.NOT_FOUND);
        }
        return Result.ok(category);
    }

    async findAll(): Promise<Result<Category[]>> {
        return Result.ok(this.categories);
    }

    async findAllWithSubcategories(): Promise<Result<Category[]>> {
        return Result.ok(this.categories);
    }

    async delete(id: string): Promise<Result<void>> {
        const index = this.categories.findIndex((c) => c.id === id);
        if (index === -1) {
            return Result.fail(CategoryErrors.NOT_FOUND);
        }
        this.categories.splice(index, 1);
        return Result.ok();
    }

    // Query implementations for use cases
    findDetailsById: FindCategoryDetailsByIdQuery = {
        execute: async (
            id: string,
            { getSubcategories }: { getSubcategories?: boolean } = {},
        ): Promise<Result<CategoryDetailsDTO>> => {
            const category = this.categories.find((c) => c.id === id);
            if (!category) {
                return Result.fail(CategoryErrors.NOT_FOUND);
            }

            const dto: CategoryDetailsDTO = {
                id: category.id,
                name: category.name,
                alias: category.alias,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
                deletedAt: category.deletedAt,
            };

            if (getSubcategories && category.subcategories) {
                dto.subcategories = category.subcategories.map((sub) => ({
                    id: sub.id,
                    name: sub.name,
                    alias: sub.alias,
                }));
            }

            return Result.ok(dto);
        },
    };

    findMany: FindManyCategoriesQuery = {
        execute: async ({
            getSubcategories,
        }: {
            getSubcategories?: boolean;
        } = {}): Promise<Result<CategoryListDTO>> => {
            const dtos: CategoryListDTO = this.categories.map((category) => {
                const dto: CategoryDetailsDTO = {
                    id: category.id,
                    name: category.name,
                    alias: category.alias,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                    deletedAt: category.deletedAt,
                };

                if (getSubcategories && category.subcategories) {
                    dto.subcategories = category.subcategories.map((sub) => ({
                        id: sub.id,
                        name: sub.name,
                        alias: sub.alias,
                    }));
                }

                return dto;
            });

            return Result.ok(dtos);
        },
    };
}
