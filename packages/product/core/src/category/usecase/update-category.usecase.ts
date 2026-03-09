import { Alias, Result, UseCase } from "@pharmacore/shared";
import { CategoryRepository } from "../provider";
import { Category, CategoryProps, SubcategoriesList } from "../model";
import { CategoryErrors } from "../errors";

export interface UpdateCategoryIn {
    id: string;
    name?: string;
    alias: string;
    subcategories?: {
        name: string;
        id?: string;
        alias: string;
        order?: number;
    }[];
}

export class UpdateCategoryUseCase implements UseCase<UpdateCategoryIn, void> {
    constructor(private readonly repo: CategoryRepository) {}

    async execute(data: UpdateCategoryIn): Promise<Result<void>> {
        const categoryResult = await this.repo.findById(data.id);

        if (categoryResult.isFailure) {
            return Result.fail(CategoryErrors.NOT_FOUND);
        }

        const category = categoryResult.instance;
        const categoryName = data.name ?? category.name;
        const categoryAlias =
            data.alias ?? category.alias ?? Alias.fromText(categoryName).value;

        const newSubcategories = data.subcategories
            ?.map((sub, index) => {
                const alreadyExists = category.subcategories.find(
                    (s) => s.id === sub.id,
                );

                const nameWasChanged =
                    alreadyExists && sub.name !== alreadyExists.name;

                const aliasWasChanged =
                    alreadyExists && sub.alias !== alreadyExists.alias;

                if (alreadyExists && !nameWasChanged && !aliasWasChanged) {
                    return { ...alreadyExists.props, order: index };
                }

                return {
                    name: sub.name,
                    id: sub.id,
                    alias: sub.alias,
                    parentId: data.id,
                    order: index,
                };
            })
            .filter((subcat) => subcat !== undefined);

        const subcategoriesResult = SubcategoriesList.tryCreate(
            newSubcategories ?? category.subcategories.map((s) => s.props),
        );

        if (subcategoriesResult.isFailure) {
            return subcategoriesResult.withFail;
        }

        const newCategoryProps: CategoryProps = {
            name: categoryName,
            alias: categoryAlias,
            subcategories: subcategoriesResult.instance,
            id: category.id,
        };

        const updatedCategoryResult = Category.tryCreate(newCategoryProps);

        if (updatedCategoryResult.isFailure) {
            return updatedCategoryResult.withFail;
        }

        return await this.repo.update(updatedCategoryResult.instance);
    }
}
