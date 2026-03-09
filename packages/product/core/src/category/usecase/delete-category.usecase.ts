import { Result, UseCase } from "@pharmacore/shared";
import { CategoryRepository } from "../provider";
import { CategoryErrors } from "../errors";

export interface DeleteCategoryIn {
	id: string;
}

export class DeleteCategoryUseCase implements UseCase<DeleteCategoryIn, void> {
	constructor(private readonly provider: CategoryRepository) {}
	async execute({ id }: DeleteCategoryIn): Promise<Result<void>> {
		const categoryExists = await this.provider.findById(id);

		if (categoryExists.isFailure) {
			return Result.fail(CategoryErrors.NOT_FOUND);
		}

		return await this.provider.delete(id);
	}
}
