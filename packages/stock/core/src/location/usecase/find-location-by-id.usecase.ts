import { Result, UseCase } from "@pharmacore/shared";
import { LocationRepository } from "../provider/location.repository";
import { Location } from "../model/location.entity";
import { LocationIn } from "../dto";

export interface FindLocationByIdIn extends LocationIn {}
export interface FindLocationByIdOut extends Location {}

export class FindLocationById implements UseCase<
	FindLocationByIdIn,
	FindLocationByIdOut
> {
	constructor(private readonly repo: LocationRepository) {}

	async execute({
		id,
	}: FindLocationByIdIn): Promise<Result<FindLocationByIdOut>> {
		const result = await this.repo.findById(id);
		if (result.isFailure) {
			return result.withFail;
		}

		return Result.ok(result.instance);
	}
}
