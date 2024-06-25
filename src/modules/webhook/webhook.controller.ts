import { Body, Controller, Post, Query } from '@nestjs/common'

import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  errorAlert(@Body() payload: any, @Query('robot') robot: string) {
    return this.webhookService.errorAlert(payload, robot)
  }
}
