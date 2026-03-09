import { Result } from "@pharmacore/shared";

export interface RolesExistence {
  exists(ids: string[]): Promise<Result<boolean>>;
}
