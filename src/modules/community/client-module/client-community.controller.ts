import { Controller, Get, Param, Query } from '@nestjs/common'

import { QueryCommunityDto } from '../dto/community.dto'
import { CommunityClientService } from './client-community.service'

@Controller('community_C')
export class CommunityClientController {
  constructor(private readonly clientService: CommunityClientService) {}

  @Get('list')
  list(@Query() query: QueryCommunityDto) {
    return this.clientService.search(query)
  }

  @Get('detail/:id')
  detail(@Param('id') id: string) {
    const idNum = Number(id)
    return this.clientService.findOne(idNum)
  }

  @Get('preview/:uuid')
  preview(@Param('uuid') uuid: string) {
    return this.clientService.preview(uuid)
  }

  @Get('get_config')
  getConfig() {
    return this.clientService.getConfig()
  }
}
