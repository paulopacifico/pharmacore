import { Result, UseCase } from "@pharmacore/shared";
import { FindManyCategoriesQuery } from "../provider";
import { CategoryListDTO } from "../dto";
import { CategoryErrors } from "../errors";

export interface FindAllCategoriesOut extends CategoryListDTO {}

export interface FindAllCategoriesIn {
	getSubcategories?: boolean;
}

export class FindAllCategoriesUseCase implements UseCase<
	FindAllCategoriesIn,
	FindAllCategoriesOut
> {
	constructor(private readonly query: FindManyCategoriesQuery) {}

	async execute({ getSubcategories }: FindAllCategoriesIn = {}): Promise<
		Result<FindAllCategoriesOut>
	> {
		const categoriesResult = await this.query.execute({ getSubcategories });

		if (categoriesResult.isFailure) {
			return Result.fail(CategoryErrors.MANY_NOT_FOUND);
		}

		return Result.ok(categoriesResult.instance);
	}
}
