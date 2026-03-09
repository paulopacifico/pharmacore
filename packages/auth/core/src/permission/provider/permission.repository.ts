import { CrudRepository } from "@pharmacore/shared";
import { Permission } from "../model/permission.entity";

export interface PermissionRepository extends CrudRepository<Permission> {}
