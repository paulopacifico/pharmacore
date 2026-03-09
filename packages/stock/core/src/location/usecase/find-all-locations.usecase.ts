import { Result, UseCase } from "@pharmacore/shared";
import { LocationRepository } from "../provider/location.repository";
import { Location } from "../model/location.entity";

export interface FindAllLocationsOut extends Array<Location> {}

export class FindAllLocations implements UseCase<void, FindAllLocationsOut> {
    constructor(private readonly repo: any) {} // todo implementar query

    async execute(): Promise<Result<FindAllLocationsOut>> {
        const result = await this.repo.findAll();
        if (result.isFailure) {
            return result.withFail;
        }

        return Result.ok(result.instance);
    }
}
