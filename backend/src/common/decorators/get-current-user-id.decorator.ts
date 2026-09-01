import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string | null => {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { sub?: string; userId?: string } }>();
    const user = request.user;
    return user?.sub ?? user?.userId ?? null;
  },
);
