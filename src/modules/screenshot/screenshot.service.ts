import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import puppeteer from 'puppeteer'
import { ROOT_PATH } from 'src/constants/app.constants'

import { BROWSER_LAUNCH_OPTIONS } from './utils'
@Injectable()
export class ScreenshotService {
  /**
   * 截取网页图片
   * @param url 页面访问地址
   * @returns 图片地址
   */
  async getScreenshot(url: string) {
    const browser = await puppeteer.launch(BROWSER_LAUNCH_OPTIONS)
    const page = await browser.newPage()
    await page.goto(url)
    // 滚动到页面底部，保证页面中图片都渲染出来
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0
        const distance = 300
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance

          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve('滚动完毕')
          }
        }, 100)
      })
    })

    // 检测是否存在 screenshot 目录，不存在则创建
    // TODO 这里截图应该是上传oss，这只是个demo
    const screenshotDir = path.resolve(ROOT_PATH, 'screenshot')

    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir)
    }

    const hash = crypto
      .createHash('md5')
      .update(`${url}_${Date.now()}`)
      .digest('hex')
    await page.screenshot({
      fullPage: true,
      path: `${screenshotDir}/${hash}.jpg`
    })
    await browser.close()

    return {
      msg: '截图成功',
      pic_name: `${hash}.jpg`
    }
  }

  // 生成 pdf
  async generatePDF(html: string) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch(BROWSER_LAUNCH_OPTIONS)

        const page = await browser.newPage()
        if (!html) {
          reject('未检测合法html')
        }

        await page.setContent(html)
        const buffer = await page.pdf({
          format: 'A4',
          margin: {
            top: '80px',
            left: '60px',
            right: '60px',
            bottom: '80px'
          }
        })
        await page.close()
        await browser.close()
        resolve(buffer)
      } catch (error) {
        reject(error)
      }
    })
  }
}
