/** 讯飞星火能力 */
import * as crypto from 'crypto'

/**
 * 生成星火签名
 * @param appId 星火应用密钥
 * @param secret 星火应用密钥
 * @returns
 */
export const generateSignature = (appId: string, secret: string) => {
  const timestamp = Math.floor(Date.now() / 1000)

  const auth = crypto
    .createHash('md5')
    .update(`${appId}${timestamp}`)
    .digest('hex')

  const signature = crypto
    .createHmac('sha1', secret)
    .update(auth, 'utf-8')
    .digest('base64')

  return { signature, timestamp, appId }
}
