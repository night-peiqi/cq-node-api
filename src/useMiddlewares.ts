import { INestApplication } from '@nestjs/common'
import { json } from 'body-parser'
import { loggerMiddleware } from './middlewares/logger.middleware'

// import * as cors from 'cors';
// import { CORS_HOSTS } from './config/app.config';
// import { AuthenticationMiddleware } from './middlewares/authentication.middleware'

/** 跨域配置 */
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (CORS_HOSTS.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

export const useMiddlewares = (app: INestApplication) => {
  /** 跨域中间件 */
  // app.use(cors(corsOptions));
  /** body limit 中间件 */
  app.use(json({ limit: '1mb' })) //设置post body数据的大小
  /** 鉴权中间件 */
  // app.use(AuthenticationMiddleware)
  /** 日志中间件 */
  app.use(loggerMiddleware)
}
