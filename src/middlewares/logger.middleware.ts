import { Logger } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

export function loggerMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const logger = new Logger('HTTP')
  const { ip, method, originalUrl: url, body } = request
  const userAgent = request.get('user-agent') || ''
  const referer = request.get('referer') || ''
  const startTime = Date.now()

  response.on('finish', () => {
    const { statusCode } = response
    const contentLength = response.get('content-length')

    const logEntry = {
      method,
      url,
      statusCode,
      contentLength,
      userAgent,
      referer,
      ip,
      body,
      headers: request.headers,
      responseTime: `${Date.now() - startTime}ms`
    }

    logger.log(JSON.stringify(logEntry))
  })

  next()
}
