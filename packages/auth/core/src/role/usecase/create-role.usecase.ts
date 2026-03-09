import { Result, UseCase } from "@pharmacore/shared";
import { Role } from "../model/role.entity";
import { RoleErrors } from "../errors";
import { RoleDTO } from "../dto";
import { PermissionsExistQuery, RoleRepository } from "../provider";

export interface CreateRoleIn {
  name: string;
  description: string;
  permissionIds: string[];
}

export interface CreateRoleOut extends RoleDTO {}

export class CreateRole implements UseCase<CreateRoleIn, CreateRoleOut> {
  constructor(
    private readonly repo: RoleRepository,
    private readonly permissionChecker: PermissionsExistQuery,
  ) {}

  async execute({
    name,
    description,
    permissionIds,
  }: CreateRoleIn): Promise<Result<CreateRoleOut>> {
    const result = await this.repo.findByName(name);

    if (result.isOk) {
      return Result.fail(RoleErrors.NAME_ALREADY_EXISTS);
    }

    if (permissionIds.length > 0) {
      const exists = await this.permissionChecker.execute(permissionIds);
      if (exists.isFailure) {
        return Result.fail(exists.errors!);
      }
    }
    const role = Role.tryCreate({
      name,
      description,
      permissionIds: permissionIds,
    });

    if (role.isFailure) {
      return Result.fail(role.errors!);
    }

    const createResult = await this.repo.create(role.instance);
    if (createResult.isFailure) {
      return createResult.withFail;
    }

    return Result.ok();
  }
}
