import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import * as FormData from 'form-data'
import { firstValueFrom } from 'rxjs'
import {
  WEIXIN_GET_TOKEN,
  WENXIN_KNOWLEDEG_ASK
} from 'src/apis/knowledge-base.apis'
import { WENXIN_ENUM } from 'src/enum/wenxin.enum'
import { XUNFEI_ENUM } from 'src/enum/xfyun.enum'
import { bufferToStream } from 'src/utils'
import { generateSignature } from 'src/utils/xfyun'

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * 获取星火签名
   * @returns
   */
  getSignature() {
    return generateSignature(XUNFEI_ENUM.APPID, XUNFEI_ENUM.SECRET)
  }

  /**
   * 上传知识库
   * @param file
   * @returns
   */
  async upload(file) {
    const formData = new FormData()

    // 注入file、fileType
    const fileStream = bufferToStream(file.buffer)
    formData.append('file', fileStream, { filename: file.originalname })
    formData.append('fileType', 'wiki')

    // 文件拆分配置
    const extend = {
      qaSplitExtends: {
        questionMark: 'Q：',
        answerMark: 'A：'
      }
    }
    formData.append('extend', JSON.stringify(extend))

    const signatureData = generateSignature(
      XUNFEI_ENUM.APPID,
      XUNFEI_ENUM.SECRET
    )

    const res = await firstValueFrom(
      this.httpService.post(
        'https://chatdoc.xfyun.cn/openapi/fileUpload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            appId: XUNFEI_ENUM.APPID,
            timestamp: signatureData.timestamp,
            signature: signatureData.signature
          }
        }
      )
    )

    return res.data
  }

  /**
   * 千帆-获取token
   */
  async getAccessToken() {
    const res = await firstValueFrom(
      this.httpService.post(
        `${WEIXIN_GET_TOKEN}?grant_type=client_credentials&client_id=${WENXIN_ENUM.WENXIN_APP_APPIKEY}&client_secret=${WENXIN_ENUM.WENXIN_APP_SECRETKEY}`
      )
    )
    return res.data
  }

  /**
   * 千帆-问答接口
   */
  async ask(data, query) {
    const res = await firstValueFrom(
      this.httpService.post(
        `${WENXIN_KNOWLEDEG_ASK}?access_token=${query.access_token}`,
        data
      )
    )

    return res.data
  }
}
