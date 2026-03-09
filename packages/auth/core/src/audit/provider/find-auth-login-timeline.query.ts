import { Result } from "@pharmacore/shared";
import { AuthLoginTimelinePointDTO } from "../dto";

export interface FindAuthLoginTimelineQuery {
    execute(): Promise<Result<AuthLoginTimelinePointDTO[]>>;
}
