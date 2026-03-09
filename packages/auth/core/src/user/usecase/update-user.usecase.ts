import { Result, UseCase } from "@pharmacore/shared";
import { UserErrors } from "../errors";
import { UserRepository } from "../provider";

export interface UpdateUserIn {
  id: string;
  name?: string;
  email?: string;
}

export class UpdateUserUseCase implements UseCase<UpdateUserIn, void> {
  constructor(
    private readonly userRepo: UserRepository,
  ) {}

  async execute(data: UpdateUserIn): Promise<Result<void>> {
    const hasUser = await this.userRepo.findById(data.id);
    if (hasUser.isFailure) {
      return Result.fail(UserErrors.NOT_FOUND);
    }

    const user = hasUser.instance;

    const updatedUser = user.cloneWith({
      ...user.props,
      name: data.name ?? user.name,
      email: data.email ?? user.email,
    });

    if (updatedUser.isFailure) {
      return updatedUser.withFail;
    }

    const updateResult = await this.userRepo.update(updatedUser.instance);
    if (updateResult.isFailure) {
      return updateResult.withFail;
    }

    return Result.ok();
  }
}
