import { Result } from "@pharmacore/shared";
import { UserDTO } from "../dto";

export interface FindUserByEmailQuery {
  execute(email: string): Promise<Result<UserDTO>>;
}
