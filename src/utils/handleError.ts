import { HttpException } from '@nestjs/common'
import { HTTP_CODE_ENUM, HTTP_STATUS_ENUM } from 'src/enum/app.enum'

/**
 * 业务异常，统一处理
 */
export const httpErrorException = (
  msg: string,
  code = HTTP_CODE_ENUM.ERROR
) => {
  console.log('httpErrorException', msg, code)
  throw new HttpException({ msg, code }, HTTP_STATUS_ENUM.SUCCESS)
}
