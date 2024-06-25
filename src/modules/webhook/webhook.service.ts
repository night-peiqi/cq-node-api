import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { formatTimestamp } from 'src/utils'
import { httpErrorException } from 'src/utils/handleError'

@Injectable()
export class WebhookService {
  constructor(private readonly httpService: HttpService) {}

  async errorAlert(payload: any, robot: string) {
    if (!robot) {
      httpErrorException('请传入webhook接口地址')
    }
    const params = {
      msgtype: 'markdown',
      markdown: {
        content: `新增异常报警，请相关同事注意。\n
>项目名：<font color="warning">${payload.project_name}</font>
>异常信息：<font color="warning">${
          payload.event?.title + '---' + payload.message
        }</font>
>异常时间：<font color="warning">${formatTimestamp(
          payload.event?.timestamp
        )}</font>
>异常接口：<font color="warning">${payload.event?.extra?.request?.url}</font>
>查看详情：<font color="warning">[${payload.url}](${payload.url})</font>`
      }
    }

    const robotUrl = decodeURIComponent(robot)

    const { data: ret } = await firstValueFrom(
      this.httpService.post(robotUrl, params)
    )

    if (ret.errcode === 0) {
      return ret.errmsg
    } else {
      httpErrorException(ret.errmsg)
    }
  }
}
