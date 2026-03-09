import { Result, UseCase } from "@pharmacore/shared";
import { BranchOverviewDTO } from "../dto";
import { FindBranchOverviewQuery } from "../provider";

export interface FindBranchOverviewOut extends BranchOverviewDTO {}

export class FindBranchOverviewUseCase
    implements UseCase<void, FindBranchOverviewOut>
{
    constructor(private readonly query: FindBranchOverviewQuery) {}

    async execute(): Promise<Result<FindBranchOverviewOut>> {
        const result = await this.query.execute();

        if (result.isFailure) {
            return result.withFail;
        }

        return Result.ok(result.instance);
    }
}
