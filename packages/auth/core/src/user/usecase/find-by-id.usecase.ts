import { Result, UseCase } from "@pharmacore/shared";
import { UserDTO } from "../dto";
import { FindUserByIdQuery } from "../provider";

export interface GetUserByIdOut extends UserDTO {}

export class FindUserByIdUseCase implements UseCase<string, GetUserByIdOut> {
  constructor(private readonly findById: FindUserByIdQuery) {}

  async execute(id: string): Promise<Result<GetUserByIdOut>> {
    const userResult = await this.findById.execute(id);
    if (userResult.isFailure) {
      return userResult.withFail;
    }

    const user = userResult.instance;

    return Result.ok(user);
  }
}
