import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { zip } from 'compressing'
import { Response } from 'express'
import { join } from 'path'

import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    console.log('file', file)
    return '上传成功'
  }

  @Get('export')
  download(@Res() res: Response) {
    const filePath = join(__dirname, '../../images/test.jpeg')
    res.download(filePath)
  }

  @Get('stream')
  stream(@Res() res: Response) {
    const filePath = join(__dirname, '../../images/test.jpeg')
    const tarStream = new zip.Stream()
    tarStream.addEntry(filePath)

    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', 'attachment; filename=stream-pic')

    tarStream.pipe(res)
  }
}
