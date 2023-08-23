import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles-auth.decorator';

const ACCESS_DENIED_MSG = 'Acess denied.';
const FORBIDDEN_MSG = 'Forbidden.';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: ACCESS_DENIED_MSG });
      }

      const user = this.jwtService.verify(token);
      req.user = user;

      return req.user.roles.some((role: { value: string }) => requiredRoles.includes(role.value));
    } catch (e) {
      throw new HttpException(FORBIDDEN_MSG, HttpStatus.FORBIDDEN);
    }
  }
}
