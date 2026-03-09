import { Result, UseCase } from "@pharmacore/shared";
import { BranchDetailsDTO } from "../dto";
import { FindBranchDetailsByIdQuery } from "../provider";
import { BranchErrors } from "../errors";

export interface FindBranchByIdIn {
    id: string;
}

export interface FindBranchByIdOut extends BranchDetailsDTO {}

export class FindBranchByIdUseCase implements UseCase<
    FindBranchByIdIn,
    FindBranchByIdOut
> {
    constructor(private readonly query: FindBranchDetailsByIdQuery) {}

    async execute({
        id,
    }: FindBranchByIdIn): Promise<Result<FindBranchByIdOut>> {
        const branchResult = await this.query.execute(id);

        if (branchResult.isFailure) {
            return Result.fail(BranchErrors.NOT_FOUND);
        }

        return Result.ok(branchResult.instance!);
    }
}
