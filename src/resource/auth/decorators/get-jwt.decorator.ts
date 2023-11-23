import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type jwtPayload = {
  id: number,
  email: string,
  iat: number,
  exp: number
}

export const Jwt = createParamDecorator(
  (data: unknown, context: ExecutionContext): jwtPayload => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
