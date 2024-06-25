import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { HTTP_CONNECT_CONFIG } from 'src/constants/app.constants'

@Global()
@Module({
  imports: [HttpModule.register(HTTP_CONNECT_CONFIG)],
  exports: [HttpModule]
})
export class GlobalHttpModule {}
