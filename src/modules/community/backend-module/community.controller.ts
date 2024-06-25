import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'

import {
  ModifyCommunityVisibleDto,
  QueryCommunityDto
} from '../dto/community.dto'
import { SaveCommunityDto } from '../dto/save-community.dto'
import { CommunityBackendService } from './community.service'

@Controller('community_B')
export class CommunityBackendController {
  constructor(private readonly backendService: CommunityBackendService) {}

  @Get('list')
  newsList(@Query() query: QueryCommunityDto) {
    return this.backendService.search(query)
  }

  @Get('detail/:id')
  detail(@Param('id') id: string) {
    const idNum = Number(id)
    return this.backendService.findOne(idNum)
  }

  @Get('get_config')
  getConfig() {
    return this.backendService.getConfig()
  }

  @Post('create')
  create(@Body() createData: SaveCommunityDto) {
    return this.backendService.create(createData)
  }

  @Post('save_draft')
  saveDraft(@Body() saveDraftData: SaveCommunityDto) {
    return this.backendService.saveDraft(saveDraftData)
  }

  @Post('edit')
  edit(@Body() editData: SaveCommunityDto) {
    return this.backendService.edit(editData)
  }

  @Post('change_visible')
  changeVisible(@Body() body: ModifyCommunityVisibleDto) {
    return this.backendService.changeVisible(body)
  }

  @Post('delete/:uuid')
  delNews(@Param('uuid') uuid: string) {
    return this.backendService.del(uuid)
  }
}
