import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('role', context.getHandler())
    console.log('经过了守卫', roles)
    const req = context.switchToHttp().getRequest()

    if (roles?.includes(req?.query?.role)) {
      return true
    } else {
      return false
    }
  }
}
