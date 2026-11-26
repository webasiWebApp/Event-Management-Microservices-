import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from './auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const id = request.headers['x-user-id'];
    const role = request.headers['x-user-role'];
    if (!id || !role) throw new UnauthorizedException('Missing x-user-id or x-user-role header');
    if (!['CLIENT', 'VENDOR', 'PLANNER', 'ADMIN'].includes(role)) throw new UnauthorizedException('Invalid user role');
    request.user = { id, role };
    const allowed = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (allowed?.length && !allowed.includes(role)) throw new ForbiddenException('Role not allowed');
    return true;
  }
}
