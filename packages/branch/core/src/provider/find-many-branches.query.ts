import { Result } from "@pharmacore/shared";
import {
    FindManyBranchesIn,
    FindManyBranchesOut,
} from "../dto/find-branch.dto";

export interface FindManyBranchesQuery {
    execute(input: FindManyBranchesIn): Promise<Result<FindManyBranchesOut>>;
}
