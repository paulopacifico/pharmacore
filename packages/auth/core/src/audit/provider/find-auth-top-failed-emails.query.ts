import { Result } from "@pharmacore/shared";
import { AuthTopFailedEmailDTO } from "../dto";

export interface FindAuthTopFailedEmailsQuery {
    execute(): Promise<Result<AuthTopFailedEmailDTO[]>>;
}
