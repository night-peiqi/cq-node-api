import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { KnowledgeBaseService } from './knowledge-base.service'

@Controller('knowledge_base')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Get('getSignature')
  getSignature() {
    return this.knowledgeBaseService.getSignature()
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return this.knowledgeBaseService.upload(file)
  }

  /**
   * 千帆-接口
   */
  @Get('access_token')
  getWenxinToken() {
    return this.knowledgeBaseService.getAccessToken()
  }

  @Post('ask')
  async ask(@Body() body, @Query() query) {
    return await this.knowledgeBaseService.ask(body, query)
  }
}
