/**
 * 全局 鉴权中间件
 */
import { NextFunction, Request, Response } from 'express'
import { WHITE_LIST } from 'src/config/app.config'
import { HTTP_CODE_ENUM } from 'src/enum/app.enum'
import { verifyToken } from 'src/utils'
import { httpErrorException } from 'src/utils/handleError'

export function AuthenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (WHITE_LIST.includes(req.originalUrl)) {
    next()
  } else {
    const token = req.headers['authorization']
    const userinfo = verifyToken(token)

    if (userinfo?.userid) {
      req.body.userid = userinfo.userid
      req.body.creator_id = userinfo.userid
      next()
    } else {
      httpErrorException('未登录', HTTP_CODE_ENUM.NO_AUTHENTICATION)
    }
  }
}
