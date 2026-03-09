import { Result, UseCase } from "@pharmacore/shared";
import { FindCategoryDetailsByIdQuery } from "../provider";
import { CategoryDetailsDTO } from "../dto";
import { CategoryErrors } from "../errors";

export interface FindCategoryByIdIn {
	id: string;
	getSubcategories?: boolean;
}

export interface FindCategoryByIdOut extends CategoryDetailsDTO {}

export class FindCategoryByIdUseCase implements UseCase<
	FindCategoryByIdIn,
	FindCategoryByIdOut
> {
	constructor(private readonly query: FindCategoryDetailsByIdQuery) {}

	async execute({
		id,
		getSubcategories,
	}: FindCategoryByIdIn): Promise<Result<FindCategoryByIdOut>> {
		const categoryResult = await this.query.execute(id, {
			getSubcategories,
		});

		if (categoryResult.isFailure) {
			return Result.fail(CategoryErrors.NOT_FOUND);
		}

		return Result.ok(categoryResult.instance);
	}
}
