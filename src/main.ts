import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

import { AppModule } from './app.module'
import { ResExceptionFilter } from './common/resExceptionFilter'
import { ResInterceptor } from './common/resInterceptor'
import { useMiddlewares } from './useMiddlewares'
// import { RoleGuard } from './guard/role'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  /** 设置api前缀 */
  app.setGlobalPrefix('api', { exclude: ['healthy'] })

  /** 设置静态资源目录 */
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/images'
  })

  /** 注册异常拦截器 */
  app.useGlobalFilters(new ResExceptionFilter())

  /** 注册全局拦截器 */
  app.useGlobalInterceptors(new ResInterceptor())

  /** 注册全局守卫 */
  // app.useGlobalGuards(new RoleGuard())

  /** 注册中间件 */
  useMiddlewares(app)
  await app.listen(3001)
}

bootstrap()
