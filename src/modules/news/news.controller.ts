import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'

import { SaveNewsDto } from './dto/save-news.dto'
import { QueryNewsDto, QueryVisibleDto } from './dto/query.dto'
import { NewsService } from './news.service'

@Controller('news_B')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('list')
  newsList(@Query() query: QueryNewsDto) {
    return this.newsService.search(query)
  }

  @Get('detail/:id')
  detail(@Param('id') id: string) {
    const idNum = Number(id)
    return this.newsService.findOne(idNum)
  }

  @Post('create')
  createNews(@Body() createNewsData: SaveNewsDto) {
    return this.newsService.createNews(createNewsData)
  }

  @Post('save_draft')
  saveDraft(@Body() createNewsData: SaveNewsDto) {
    return this.newsService.saveDraft(createNewsData)
  }

  @Post('edit')
  edit(@Body() editNewsData: SaveNewsDto) {
    return this.newsService.edit(editNewsData)
  }

  @Post('change_visible')
  changeVisible(@Body() body: QueryVisibleDto) {
    return this.newsService.changeVisible(body)
  }

  @Post('delete/:uuid')
  delNews(@Param('uuid') uuid: string) {
    return this.newsService.delNews(uuid)
  }

  @Get('get_config')
  getConfig() {
    return this.newsService.getConfig()
  }
}
