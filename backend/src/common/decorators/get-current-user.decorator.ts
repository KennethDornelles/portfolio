import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): unknown => {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: Record<string, unknown> }>();
    if (!data) return request.user;
    return request.user?.[data];
  },
);
