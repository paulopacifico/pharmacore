import { Result } from "@pharmacore/shared";
import { AuthActivityRankingItemDTO } from "../dto";

export interface FindAuthActivityRankingQuery {
    execute(): Promise<Result<AuthActivityRankingItemDTO[]>>;
}
