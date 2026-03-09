import { Result, UseCase } from "@pharmacore/shared";
import { FindBrandDetailsByIdQuery } from "../provider";
import { BrandDetailsDTO } from "../dto";
import { BrandErrors } from "../errors";

export interface FindBrandByIdIn {
    id: string;
}

export interface FindBrandByIdOut extends BrandDetailsDTO {}

export class FindBrandByIdUseCase implements UseCase<
    FindBrandByIdIn,
    FindBrandByIdOut
> {
    constructor(private readonly query: FindBrandDetailsByIdQuery) {}

    async execute(data: FindBrandByIdIn): Promise<Result<FindBrandByIdOut>> {
        const brandResult = await this.query.execute(data.id);

        if (brandResult.isFailure) {
            return Result.fail(BrandErrors.NOT_FOUND);
        }

        return Result.ok(brandResult.instance);
    }
}
