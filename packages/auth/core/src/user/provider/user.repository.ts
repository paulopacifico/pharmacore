import { CrudRepository, Result } from "@pharmacore/shared";
import { User } from "../model/user.entity";

export interface UserRepository extends CrudRepository<User> {
    findByEmail(email: string): Promise<Result<User>>;
    updateRoles(userId: string, roleIds: string[]): Promise<Result<void>>;
}
