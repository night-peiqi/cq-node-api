/**
 * 全局异常拦截
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { Response } from 'express'
// import { HTTP_STATUS_ENUM } from 'src/enum/app.enum'

// enum ERROR_TYPE {
//   BUSINESS = 'Business Exception', // 业务异常
//   SYSTEM = 'System Exception' // 系统异常
// }

interface IErrorRes {
  code?: number
  msg?: string
  status?: number
  statusCode?: number
  message?: string
  other?: object
}

@Catch(HttpException)
export class ResExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    // http 响应对象
    const res = ctx.getResponse<Response>()

    const status = exception.getStatus()
    // 异常响应对象
    const response = exception.getResponse() as IErrorRes

    res.status(status).json({
      code: response.code || response.statusCode,
      msg: response.msg || response.message
    })
  }
}
