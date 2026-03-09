import { PermissionDTO } from '@pharmacore/auth';
import { SetMetadata } from '@nestjs/common';

export const RequirePermission = (permission: PermissionDTO) =>
  SetMetadata('require-permission', permission);
