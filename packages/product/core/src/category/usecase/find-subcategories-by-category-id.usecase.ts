import { Result, UseCase } from "@pharmacore/shared";
import { FindSubcategoriesByCategoryIdQuery } from "../provider";
import { SubcategoryErrors } from "../errors";
import { SubcategoryListDTO } from "../dto/subcategory-list.dto";

export interface FindSubcategoriesByCategoryIn {
	categoryId: string;
}

export interface FindSubcategoriesByCategoryOut extends SubcategoryListDTO {}

export class FindSubcategoriesByCategoryUseCase implements UseCase<
	FindSubcategoriesByCategoryIn,
	FindSubcategoriesByCategoryOut
> {
	constructor(private readonly query: FindSubcategoriesByCategoryIdQuery) {}

	async execute({
		categoryId,
	}: FindSubcategoriesByCategoryIn): Promise<
		Result<FindSubcategoriesByCategoryOut>
	> {
		const subcategories = await this.query.execute(categoryId);

		if (subcategories.isFailure) {
			return Result.fail(SubcategoryErrors.MANY_NOT_FOUND);
		}

		return Result.ok(subcategories.instance);
	}
}
