import { Result, UseCase } from "@pharmacore/shared";
import { Snapshot } from "../model/snapshot.entity";
import { SnapshotRepository } from "../provider/snapshot.repository";

export interface CreateSnapshotInput {
	skuItem: string;
	quantity: number;
}

export class CreateSnapshot implements UseCase<CreateSnapshotInput, void> {
	constructor(private readonly repo: SnapshotRepository) {}
	async execute(data: CreateSnapshotInput): Promise<Result<void>> {
		const result = Snapshot.tryCreate(data);
		if (result.isFailure) {
			return result.withFail;
		}
		return this.repo.create(result.instance);
	}
}
