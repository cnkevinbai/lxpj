import { Injectable } from '@nestjs/common'
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const Roles = (...roles: string[]) => Reflect.metadata('roles', roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user
    return roles.includes(user.role)
  }
}
