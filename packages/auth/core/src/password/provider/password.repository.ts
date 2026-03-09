import { CrudRepository, Result } from "@pharmacore/shared";
import { Password } from "../model/password.entity";

export interface PasswordRepository extends Omit<
	CrudRepository<Password>,
	"create"
> {
	create(password: Password, userId: string): Promise<Result<Password>>;
	findByUserId(id: string): Promise<Result<Password>>;
}
