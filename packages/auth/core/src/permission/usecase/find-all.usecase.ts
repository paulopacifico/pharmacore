import { Result, UseCase } from "@pharmacore/shared";
import { FindAllPermissionQuery } from "../provider/permission.query";
import { PermissionDTO } from "../dto";

export class FindAllPermissions implements UseCase<void, PermissionDTO[]> {
  constructor(private readonly findAllQuery: FindAllPermissionQuery) {}

  async execute(): Promise<Result<PermissionDTO[]>> {
    const permissions = await this.findAllQuery.execute();
    if (permissions.isFailure) {
      return permissions.withFail;
    }

    return Result.ok(permissions.instance);
  }
}
