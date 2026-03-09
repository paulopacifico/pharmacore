import { Result } from "@pharmacore/shared";
import { UserDTO } from "../dto";

export interface FindUserByIdQuery {
  execute(id: string): Promise<Result<UserDTO>>;
}
