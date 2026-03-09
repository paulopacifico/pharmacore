import { Result, UseCase } from "@pharmacore/shared";
import { BrandListDTO, BrandQueryDTO } from "../dto";
import { FindManyBrandsQuery } from "../provider";

export type FindManyBrandsIn = BrandQueryDTO;

export interface FindManyBrandsOut extends BrandListDTO {}

export class FindManyBrandsUseCase implements UseCase<
    FindManyBrandsIn,
    FindManyBrandsOut
> {
    constructor(private readonly query: FindManyBrandsQuery) {}

    async execute(input: FindManyBrandsIn): Promise<Result<FindManyBrandsOut>> {
        const brandsResult = await this.query.execute(input);

        if (brandsResult.isFailure) {
            return brandsResult.withFail;
        }

        return Result.ok(brandsResult.instance!);
    }
}
