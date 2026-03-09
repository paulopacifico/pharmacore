import { Result, UseCase } from "@pharmacore/shared";
import { LocationRepository } from "../provider/location.repository";
import { LocationIn } from "../dto";

export interface DeleteLocationIn extends LocationIn {}

export class DeleteLocation implements UseCase<DeleteLocationIn, void> {
	constructor(private readonly locationRepo: LocationRepository) {}

	async execute({ id }: DeleteLocationIn): Promise<Result<void>> {
		const locationExists = await this.locationRepo.findById(id);

		if (locationExists.isFailure) {
			return locationExists.withFail;
		}

		return this.locationRepo.delete(id);
	}
}
