import { Result, UseCase } from "@pharmacore/shared";
import { FindAllUsersInDTO, FindAllUsersOutDTO } from "../dto";
import { FindAllUsersQuery } from "../provider";

export class FindAllUsersUseCase
  implements UseCase<FindAllUsersInDTO, FindAllUsersOutDTO>
{
  constructor(private readonly findAll: FindAllUsersQuery) {}

  async execute(input: FindAllUsersInDTO): Promise<Result<FindAllUsersOutDTO>> {
    const usersResult = await this.findAll.execute(input);
    if (usersResult.isFailure) {
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

    return Result.ok(usersResult.instance);
  }
}
