import { Alias, Id, Result, UseCase } from "@pharmacore/shared";
import { CategoryRepository } from "../provider";
import { Category, SubcategoriesList } from "../model";

export interface CreateCategoryIn {
    name: string;
    alias: string;
    subcategories: {
        name: string;
        alias: string;
        id?: string;
        order?: number;
    }[];
}

export class CreateCategoryUseCase implements UseCase<CreateCategoryIn, void> {
    constructor(private readonly repo: CategoryRepository) {}

    async execute(data: CreateCategoryIn): Promise<Result<void>> {
        const categoryId = Id.create().value;

        const subcategories = SubcategoriesList.tryCreate(
            data.subcategories.map((sub, idx) => ({
                ...sub,
                alias: sub.alias ?? Alias.fromText(sub.name).value,
                parentId: categoryId,
                order: sub.order ?? idx,
            })),
        );

        if (subcategories.isFailure) {
            return subcategories.withFail;
        }

        const categoryResult = Category.tryCreate({
            ...data,
            id: categoryId,
            subcategories: subcategories.instance,
            alias: data.alias ?? Alias.fromText(data.name).value,
        });

        if (categoryResult.isFailure) {
            return categoryResult.withFail;
        }

        const category = categoryResult.instance;

        return await this.repo.create(category);
    }
}
