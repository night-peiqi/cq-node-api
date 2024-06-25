import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'

import { GlobalHttpModule } from './common/Global.module'
import { DbModule } from './db/db.module'
import { CommunityBackendModule } from './modules/community/backend-module/community.module'
import { CommunityClientModule } from './modules/community/client-module/client-community.module'
// import { ENV_KEY_ENUM, ENV_VALUE_ENUM } from './enum/app.enum'
import { HealthyModule } from './modules/healthy/healthy.module'
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module'
import { NewsModule } from './modules/news/news.module'
import { NewsToCModule } from './modules/news-to-c/news-to-c.module'
import { ScreenshotModule } from './modules/screenshot/screenshot.module'
import { UploadModule } from './modules/upload/upload.module'
import { WebhookModule } from './modules/webhook/webhook.module'

const envFilePath = `.env.${process.env.NODE_ENV || `development`}`
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => dotenv.config({ path: '.env' })],
      envFilePath
    }),
    DbModule,
    GlobalHttpModule,
    NewsModule,
    UploadModule,
    NewsToCModule,
    HealthyModule,
    WebhookModule,
    KnowledgeBaseModule,
    ScreenshotModule,
    CommunityBackendModule,
    CommunityClientModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}
}
