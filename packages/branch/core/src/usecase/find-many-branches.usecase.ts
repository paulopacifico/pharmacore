import { Result, UseCase } from "@pharmacore/shared";
import {
    FindManyBranchesIn,
    FindManyBranchesOut,
} from "../dto/find-branch.dto";
import { FindManyBranchesQuery } from "../provider/find-many-branches.query";

export class FindManyBranchesUseCase implements UseCase<
    FindManyBranchesIn,
    FindManyBranchesOut
> {
    constructor(private readonly query: FindManyBranchesQuery) {}

    async execute(
        input: FindManyBranchesIn,
    ): Promise<Result<FindManyBranchesOut>> {
        const branchesResult = await this.query.execute(input);

        if (branchesResult.isFailure) {
            return Result.ok({
                data: [],
                meta: {
                    page: input.page,
                    pageSize: input.pageSize,
                    total: 0,
                    totalPages: 0,
                },
            });
        }

        return Result.ok(branchesResult.instance!);
    }
}
