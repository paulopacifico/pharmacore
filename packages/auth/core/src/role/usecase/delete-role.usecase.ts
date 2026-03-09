import { Result, UseCase } from "@pharmacore/shared";
import { RoleRepository } from "../provider";

export interface DeleteRoleIn {
  id: string;
}

export class DeleteRoleUseCase implements UseCase<DeleteRoleIn, void> {
  constructor(private readonly roleRepo: RoleRepository) {}

  async execute({ id }: DeleteRoleIn): Promise<Result<void>> {
    const result = await this.roleRepo.delete(id);
    if (result.isFailure) {
      return result.withFail;
    }
    return Result.ok();
  }
}
