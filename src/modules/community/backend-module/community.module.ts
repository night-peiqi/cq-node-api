import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware'

import { CommunityTable } from '../entities/community.entity'
import { CommunityColumnTable } from '../entities/community-column.entity'
import { CommunityDraftTable } from '../entities/community-draft.entity'
import { CommunityLabelTable } from '../entities/community-label.entity'
import { CommunityBackendController } from './community.controller'
import { CommunityBackendService } from './community.service'

@Module({
  imports: [
    // 注册实体，以便当前模块使用
    TypeOrmModule.forFeature([
      CommunityTable,
      CommunityDraftTable,
      CommunityColumnTable,
      CommunityLabelTable
    ])
  ],
  controllers: [CommunityBackendController], // 注册控制器
  providers: [CommunityBackendService], // 注入服务
  exports: [CommunityBackendService] // 导出，供别的模块使用
})
export class CommunityBackendModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(CommunityBackendController)
  }
}
