import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from 'src/constants/app.constants'
import { Readable } from 'stream'

/** 是否 undefined */
export const isUndefined = (val: any) => {
  return typeof val === 'undefined'
}

/** 解密 token */
interface ITokenInfo {
  userid: string
}
export function verifyToken(
  token: string,
  secret = JWT_SECRET
): ITokenInfo | null {
  try {
    if (!token) return null
    const decoded = jwt.verify(token, secret)
    return decoded as ITokenInfo
  } catch (error) {
    // 在这里处理解密失败的情况
    console.log('error', error)
    return null
  }
}

/**
 * 日期不要毫秒
 * @param date 带有毫秒的日期
 * @returns 不带毫秒的日期
 */
export const noMsDate = (date: Date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

/**
 * 格式化时间戳
 */
export const formatTimestamp = (timestamp: number) => {
  if (!timestamp) {
    return ''
  }
  let t: string | number = Math.floor(timestamp).toString()
  if (t.length === 10) {
    t = Number(t) * 1000
  } else {
    t = Number(t)
  }

  const date = new Date(t)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // 构建格式化的日期时间字符串
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  return formattedDateTime
}

/**
 * 将 Buffer 转换为 Readable Stream。
 *
 * @param {Buffer} buffer - 需要转换的 Buffer 对象。
 * @returns {Readable} - 转换后的 Readable Stream。
 */
export const bufferToStream = (buffer: Buffer): Readable => {
  const stream = new Readable()
  stream.push(buffer)
  stream.push(null)
  return stream
}

/**
 * 格式化日期
 * @param date 日期
 * @param separator 日期分隔符
 * @returns 2024-04-17 10:47:10
 */
export const formatDate = (date: Date, separator = '-') => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}${separator}${month}${separator}${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 是否有效值
 * @param value
 * @returns Boolean
 */
export const isValid = (value: any) => {
  return (
    value &&
    value !== 'undefined' &&
    value !== 'null' &&
    value !== '0' &&
    !Number.isNaN(value)
  )
}
