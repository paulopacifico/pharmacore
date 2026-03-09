import { Result, UseCase } from "@pharmacore/shared";
import { FindAllRolesInDTO, FindAllRolesOutDTO } from "../dto";
import { FindAllRolesQuery } from "../provider";

export class FindAllRoles
  implements UseCase<FindAllRolesInDTO, FindAllRolesOutDTO>
{
  constructor(private readonly findAllRoles: FindAllRolesQuery) {}

  async execute(input: FindAllRolesInDTO): Promise<Result<FindAllRolesOutDTO>> {
    const rolesList = await this.findAllRoles.execute(input);
    if (rolesList.isFailure) {
      return Result.ok({
        data: [],
        meta: {
          page: input.page,
          pageSize: input.pageSize,
          total: 0,
          totalPages: 0,
        },
      });
    }

    return Result.ok(rolesList.instance);
  }
}
