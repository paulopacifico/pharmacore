import { Result, UseCase } from "@pharmacore/shared";
import { UserErrors } from "../errors";
import { UserRepository } from "../provider";

export interface UpdateProfileIn {
  id: string;
  name: string;
}

export class UpdateProfileUseCase implements UseCase<UpdateProfileIn, void> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(data: UpdateProfileIn): Promise<Result<void>> {
    const hasUser = await this.userRepo.findById(data.id);
    if (hasUser.isFailure) {
      return Result.fail(UserErrors.NOT_FOUND);
    }

    const user = hasUser.instance;

    const updatedUser = user.cloneWith({
      name: data.name ?? user.name,
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
