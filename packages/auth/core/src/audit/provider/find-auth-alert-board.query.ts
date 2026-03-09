import { Result } from "@pharmacore/shared";
import { AuthAlertBoardItemDTO } from "../dto";

export interface FindAuthAlertBoardQuery {
    execute(): Promise<Result<AuthAlertBoardItemDTO[]>>;
}
