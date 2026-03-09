import { Result } from "@pharmacore/shared";
import { FindAllUsersInDTO, FindAllUsersOutDTO } from "../dto";

export interface FindAllUsersQuery {
  execute(input: FindAllUsersInDTO): Promise<Result<FindAllUsersOutDTO>>;
}
