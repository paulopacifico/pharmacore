import { Result } from "@pharmacore/shared";
import { BranchOverviewDTO } from "../dto";

export interface FindBranchOverviewQuery {
    execute(): Promise<Result<BranchOverviewDTO>>;
}
