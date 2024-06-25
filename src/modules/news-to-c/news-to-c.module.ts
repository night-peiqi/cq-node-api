import { Module } from '@nestjs/common'

import { NewsModule } from '../news/news.module'
import { NewsToCController } from './news-to-c.controller'
import { NewsToCService } from './news-to-c.service'
import { NewsTable } from '../news/entities/news.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [NewsModule, TypeOrmModule.forFeature([NewsTable])],
  controllers: [NewsToCController],
  providers: [NewsToCService]
})
export class NewsToCModule {}
