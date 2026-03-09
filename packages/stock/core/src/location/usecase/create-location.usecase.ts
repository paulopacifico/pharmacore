import { Result, UseCase } from "@pharmacore/shared";
import { LocationRepository } from "../provider/location.repository";
import { Location } from "../model/location.entity";

export interface CreateLocationIn {
	name: string;
	address: string;
	isActive?: boolean;
}

export class CreateLocation implements UseCase<CreateLocationIn, void> {
	constructor(private readonly locationRepo: LocationRepository) {}

	async execute(data: CreateLocationIn): Promise<Result<void>> {
		const locationResult = Location.tryCreate({
			...data,
			isActive: data.isActive ?? true,
		});

		if (locationResult.isFailure) {
			return locationResult.withFail;
		}

		return this.locationRepo.create(locationResult.instance);
	}
}
