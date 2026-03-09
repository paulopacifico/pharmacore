import { Result } from "@pharmacore/shared";
import { AuthLoginOverviewMetricsDTO } from "../dto";

export interface FindAuthLoginOverviewQuery {
    execute(): Promise<Result<AuthLoginOverviewMetricsDTO>>;
}
