import { Result } from "@pharmacore/shared";
import { FindAllRolesInDTO, FindAllRolesOutDTO } from "../dto";

export interface FindAllRolesQuery {
  execute(input: FindAllRolesInDTO): Promise<Result<FindAllRolesOutDTO>>;
}
