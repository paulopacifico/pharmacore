import { Result } from "@pharmacore/shared";

export interface PermissionsExistQuery {
  execute(ids: string[]): Promise<Result<boolean>>;
}
