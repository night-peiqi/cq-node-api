/**
 * 响应拦截
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { HTTP_CODE_ENUM, HTTP_STATUS_ENUM } from 'src/enum/app.enum'

interface IData<T> {
  data: T
}

@Injectable()
export class ResInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IData<T>> {
    return next.handle().pipe(
      map((data) => {
        // 设置http状态码为200
        context.switchToHttp().getResponse().status(HTTP_STATUS_ENUM.SUCCESS)
        return {
          data,
          code: HTTP_CODE_ENUM.SUCCESS,
          msg: '成功'
        }
      })
    )
  }
}
