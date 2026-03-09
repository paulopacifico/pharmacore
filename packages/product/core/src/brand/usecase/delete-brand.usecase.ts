import { Result, UseCase } from "@pharmacore/shared";
import { BrandRepository } from "../provider";
import { BrandErrors } from "../errors";

export interface DeleteBrandIn {
	id: string;
}

export class DeleteBrandUseCase implements UseCase<DeleteBrandIn, void> {
	constructor(private readonly repo: BrandRepository) {}

	async execute(data: DeleteBrandIn): Promise<Result<void>> {
		const brandResult = await this.repo.findById(data.id);

		if (brandResult.isFailure) {
			return Result.fail(BrandErrors.NOT_FOUND);
		}

		return await this.repo.delete(data.id);
	}
}