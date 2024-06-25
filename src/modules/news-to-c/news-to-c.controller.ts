import { Controller, Get, Param, Query } from '@nestjs/common'

import { QueryNewsDto } from '../news/dto/query.dto'
import { NewsToCService } from './news-to-c.service'

@Controller('news_C')
export class NewsToCController {
  constructor(private readonly newsToCService: NewsToCService) {}

  /** 新闻列表，支持分页 */
  @Get('list')
  search(@Query() query: QueryNewsDto) {
    return this.newsToCService.search(query)
  }

  /** 新闻详情 */
  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    const idNum = Number(id)
    return this.newsToCService.findOne(idNum)
  }

  /** 预览 */
  @Get('preview/:uuid')
  preview(@Param('uuid') uuid: string) {
    return this.newsToCService.preview(uuid)
  }

  /** 新闻栏目 */
  @Get('get_config')
  getConfig() {
    return this.newsToCService.getConfig()
  }
}
