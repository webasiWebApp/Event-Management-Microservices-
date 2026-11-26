import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export type UserRole = 'CLIENT' | 'VENDOR' | 'PLANNER' | 'ADMIN';
export interface RequestUser { id: string; role: UserRole; }
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): RequestUser => {
  const request = context.switchToHttp().getRequest();
  return { id: request.headers['x-user-id'], role: request.headers['x-user-role'] };
});
