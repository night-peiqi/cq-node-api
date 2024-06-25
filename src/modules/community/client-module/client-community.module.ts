import { Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommunityBackendModule } from '../backend-module/community.module'
import { CommunityTable } from '../entities/community.entity'
import { CommunityClientController } from './client-community.controller'
import { CommunityClientService } from './client-community.service'

@Module({
  imports: [CommunityBackendModule, TypeOrmModule.forFeature([CommunityTable])],
  controllers: [CommunityClientController],
  providers: [CommunityClientService],
  exports: []
})
export class CommunityClientModule implements NestModule {
  configure() {}
}
