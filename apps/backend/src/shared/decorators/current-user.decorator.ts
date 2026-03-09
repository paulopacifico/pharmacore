import { UserDTO } from '@pharmacore/auth';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserDTO => {
    const req = ctx.switchToHttp().getRequest<{ user: UserDTO }>();
    const { user } = req;

    return user;
  },
);
