import { Result } from "@pharmacore/shared";
import { BranchDetailsDTO } from "../dto";

export interface FindBranchDetailsByIdQuery {
	execute(branchId: string): Promise<Result<BranchDetailsDTO>>;
}
