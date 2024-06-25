import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'

import { ScreenshotService } from './screenshot.service'

@Controller('screenshot')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @Post()
  async getScreenshot(@Body('url') url: string) {
    return await this.screenshotService.getScreenshot(url)
  }

  @Post('pdf')
  async generatePdf(@Res() res: Response, @Body('html') html: string) {
    this.screenshotService
      .generatePDF(html)
      .then((buffer) => {
        res.set({
          'content-type': 'application/pdf',
          'Content-Length': buffer.length
        })
        res.status(200)
        return res.send(buffer)
      })
      .catch((err) => {
        return res.send({
          code: 3001,
          msg: err
        })
      })
  }
}
