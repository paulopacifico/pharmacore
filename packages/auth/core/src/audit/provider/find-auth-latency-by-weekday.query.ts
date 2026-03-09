import { Result } from "@pharmacore/shared";
import { AuthLatencyByWeekdayDTO } from "../dto";

export interface FindAuthLatencyByWeekdayQuery {
    execute(): Promise<Result<AuthLatencyByWeekdayDTO[]>>;
}
