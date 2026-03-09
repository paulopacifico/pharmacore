import { Result } from "@pharmacore/shared";
import { KpiDTO } from "../dto";

export interface FindKpiQuery {
    execute(): Promise<Result<KpiDTO>>;
}
