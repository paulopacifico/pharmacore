import { Result } from "@pharmacore/shared";
import { PermissionDTO } from "../dto";

export interface FindAllPermissionQuery {
  execute(): Promise<Result<PermissionDTO[]>>;
}
