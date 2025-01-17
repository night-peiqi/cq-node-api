import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'

import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../images'),
        filename(_, file, callback) {
          const filename = 'test' + extname(file.originalname)
          return callback(null, filename)
        }
      })
    })
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
