import { Result, UseCase } from "@pharmacore/shared";
import { UserErrors } from "../errors";
import { RolesExistence, UserRepository } from "../provider";

export interface AssignRolesToUserIn {
  userId: string;
  roleIds: string[];
}

export class AssignRolesToUserUseCase implements UseCase<AssignRolesToUserIn, void> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly rolesChecker: RolesExistence,
  ) {}

  async execute(data: AssignRolesToUserIn): Promise<Result<void>> {
    const hasUser = await this.userRepo.findById(data.userId);
    if (hasUser.isFailure) {
      return Result.fail(UserErrors.NOT_FOUND);
    }

    const exists = await this.rolesChecker.exists(data.roleIds);
    if (exists.isFailure) {
      return exists.withFail;
    }

    const updateResult = await this.userRepo.updateRoles(data.userId, data.roleIds);
    if (updateResult.isFailure) {
      return updateResult.withFail;
    }

    return Result.ok();
  }
}
