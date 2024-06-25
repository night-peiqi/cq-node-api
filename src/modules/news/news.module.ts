import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware'
import { NewsMiddleware } from 'src/middlewares/news.middleware'

import { NewsDraftTable } from './entities/draft.entity'
import { NewsTable } from './entities/news.entity'
import { NewsColumnTable } from './entities/news-column.entity'
import { NewsController } from './news.controller'
import { NewsService } from './news.service'
@Module({
  imports: [
    TypeOrmModule.forFeature([NewsTable, NewsDraftTable, NewsColumnTable])
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService] // 导出，供别的模块使用
})
export class NewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NewsMiddleware, AuthenticationMiddleware)
      .forRoutes(NewsController)
  }
}
