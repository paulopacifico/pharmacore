import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  UserErrors,
  PermissionDTO,
  PermissionPolicy,
  UserDTO,
} from '@pharmacore/auth';

@Injectable()
export class RequirePermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<PermissionDTO>(
      'require-permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserDTO = request.user;

    const policy = new PermissionPolicy(user.permissions.map((p) => p.id));

    const hasPermission = policy.check([requiredPermission]);
    if (!hasPermission) {
      context
        .switchToHttp()
        .getResponse()
        .status(403)
        .json({ errors: [UserErrors.ACCESS_DENIED] });
    }

    return hasPermission;
  }
}
