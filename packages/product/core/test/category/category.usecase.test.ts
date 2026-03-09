import {
    CreateCategoryUseCase,
    DeleteCategoryUseCase,
    FindAllCategoriesUseCase,
    FindCategoryByIdUseCase,
    UpdateCategoryUseCase,
} from "../../src/category/usecase";
import { InMemoryCategoryRepository } from "../data/in-memory-category.repo";

describe("Category UseCases", () => {
    let repo: InMemoryCategoryRepository;

    beforeEach(() => {
        repo = new InMemoryCategoryRepository();
    });

    describe("CreateCategoryUseCase", () => {
        test("should create a category with valid data", async () => {
            const useCase = new CreateCategoryUseCase(repo);

            const result = await useCase.execute({
                name: "Vitaminas",
                alias: "vitamins",
                subcategories: [],
            });

            expect(result.isOk).toBe(true);
        });

        test("should fail to create a category with empty name", async () => {
            const useCase = new CreateCategoryUseCase(repo);

            const result = await useCase.execute({
                name: "",
                alias: "vitamins",
                subcategories: [],
            });

            expect(result.isFailure).toBe(true);
        });

        test("should fail to create a category with invalid name", async () => {
            const useCase = new CreateCategoryUseCase(repo);

            const result = await useCase.execute({
                name: null as any,
                alias: "vitamins",
                subcategories: [],
            });

            expect(result.isFailure).toBe(true);
        });
    });

    describe("FindCategoryByIdUseCase", () => {
        test("should get a category by valid id", async () => {
            const useCase = new FindCategoryByIdUseCase(repo.findDetailsById);

            const result = await useCase.execute({
                id: "550e8400-e29b-41d4-a716-446655440001",
            });

            expect(result.isOk).toBe(true);
            expect(result.instance).toHaveProperty(
                "id",
                "550e8400-e29b-41d4-a716-446655440001",
            );
            expect(result.instance).toHaveProperty("name", "Eletrônicos");
        });

        test("should fail to get a category with invalid id", async () => {
            const useCase = new FindCategoryByIdUseCase(repo.findDetailsById);

            const result = await useCase.execute({ id: "invalid-id" });

            expect(result.isFailure).toBe(true);
        });

        test("should get a category with subcategories when option is enabled", async () => {
            const useCase = new FindCategoryByIdUseCase(repo.findDetailsById);

            const result = await useCase.execute({
                id: "550e8400-e29b-41d4-a716-446655440001",
                getSubcategories: true,
            });

            expect(result.isOk).toBe(true);
            expect(result.instance).toHaveProperty(
                "id",
                "550e8400-e29b-41d4-a716-446655440001",
            );
        });
    });

    describe("FindAllCategoriesUseCase", () => {
        test("should get all categories", async () => {
            const useCase = new FindAllCategoriesUseCase(repo.findMany);
            const result = await useCase.execute();

            expect(result.isOk).toBe(true);
            expect(result.instance).toHaveLength(3);
            expect(result.instance[0]).toHaveProperty("name", "Eletrônicos");
            expect(result.instance[1]).toHaveProperty("name", "Medicamentos");
            expect(result.instance[2]).toHaveProperty("name", "Cosméticos");
        });

        test("should get all categories with subcategories when option is enabled", async () => {
            const useCase = new FindAllCategoriesUseCase(repo.findMany);

            const result = await useCase.execute({ getSubcategories: true });

            expect(result.isOk).toBe(true);
            expect(result.instance).toHaveLength(3);
        });

        test("should return empty array when no categories exist", async () => {
            const emptyRepo = new InMemoryCategoryRepository();
            emptyRepo.withoutCategories();
            const allResult = await emptyRepo.findAll();
            if (allResult.isOk && allResult.instance.length > 0) {
                for (const cat of allResult.instance) {
                    await emptyRepo.delete(cat.id);
                }
            }

            const useCase = new FindAllCategoriesUseCase(emptyRepo.findMany);
            const result = await useCase.execute();

            expect(result.isOk).toBe(true);
            expect(result.instance).toHaveLength(0);
        });
    });

    describe("UpdateCategoryUseCase", () => {
        test("should update a category with valid data", async () => {
            const useCase = new UpdateCategoryUseCase(repo);

            const result = await useCase.execute({
                id: "550e8400-e29b-41d4-a716-446655440001",
                name: "Eletrônicos Atualizados",
                alias: "electronics",
            });

            expect(result.isOk).toBe(true);
        });

        test("should update only name", async () => {
            const useCase = new UpdateCategoryUseCase(repo);

            const result = await useCase.execute({
                id: "550e8400-e29b-41d4-a716-446655440002",
                name: "Medicamentos Atualizados",
                alias: "medications",
            });

            expect(result.isOk).toBe(true);
        });

        test("should fail to update a category with invalid id", async () => {
            const useCase = new UpdateCategoryUseCase(repo);

            const result = await useCase.execute({
                id: "invalid-id",
                name: "Updated Name",
                alias: "updated-alias",
            });

            expect(result.isFailure).toBe(true);
        });

        test("should fail to update a category with empty name", async () => {
            const useCase = new UpdateCategoryUseCase(repo);

            const result = await useCase.execute({
                id: "550e8400-e29b-41d4-a716-446655440001",
                name: "",
                alias: "updated-alias",
            });

            expect(result.isFailure).toBe(true);
        });
    });

    describe("DeleteCategoryUseCase", () => {
        test("should delete a category with valid id", async () => {
            const useCase = new DeleteCategoryUseCase(repo);

            const result = await useCase.execute({
                id: "550e8400-e29b-41d4-a716-446655440003",
            });

            expect(result.isOk).toBe(true);

            const findResult = await repo.findById(
                "550e8400-e29b-41d4-a716-446655440003",
            );
            expect(findResult.isFailure).toBe(true);
        });

        test("should fail to delete a category with invalid id", async () => {
            const useCase = new DeleteCategoryUseCase(repo);

            const result = await useCase.execute({ id: "invalid-id" });

            expect(result.isFailure).toBe(true);
        });
    });
});
