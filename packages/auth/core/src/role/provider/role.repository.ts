import { CrudRepository, Result } from "@pharmacore/shared";
import { Role } from "../model/role.entity";

export interface RoleRepository extends CrudRepository<Role> {
    findByName(name: string): Promise<Result<Role>>;
}
