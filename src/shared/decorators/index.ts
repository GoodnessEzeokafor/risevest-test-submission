import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const Authorization = (tag: boolean) =>
  SetMetadata('authorization', tag);

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);