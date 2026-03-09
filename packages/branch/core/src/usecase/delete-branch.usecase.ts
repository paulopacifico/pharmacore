import { Result, UseCase } from "@pharmacore/shared";
import { BranchRepository } from "../provider/branch.repository";

export interface DeleteBranchIn {
	id: string;
}

export class DeleteBranchUseCase implements UseCase<DeleteBranchIn, void> {
	constructor(private readonly repo: BranchRepository) {}

	async execute({ id }: DeleteBranchIn): Promise<Result<void>> {
		const result = await this.repo.findById(id);
		if (result.isFailure) {
			return result.withFail;
		}

		return this.repo.delete(id);
	}
}
