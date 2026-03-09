import { Result, UseCase } from "@pharmacore/shared";
import { UserDTO } from "../dto";
import { FindUserByEmailQuery } from "../provider";

export interface GetUserByEmailOut extends UserDTO {}

export class FindUserByEmailUseCase
  implements UseCase<string, GetUserByEmailOut>
{
  constructor(private readonly findByEmail: FindUserByEmailQuery) {}

  async execute(email: string): Promise<Result<GetUserByEmailOut>> {
    const userResult = await this.findByEmail.execute(email);
    if (userResult.isFailure) {
      return userResult.withFail;
    }

    return Result.ok(userResult.instance);
  }
}
