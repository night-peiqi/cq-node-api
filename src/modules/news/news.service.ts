import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { NEWS_STATUS_ENUM } from 'src/enum/news.enum'
import { noMsDate } from 'src/utils'
import { httpErrorException } from 'src/utils/handleError'
import { Repository } from 'typeorm'

import { SaveNewsDto } from './dto/save-news.dto'
import { QueryNewsDto, QueryVisibleDto } from './dto/query.dto'
import { NewsDraftTable } from './entities/draft.entity'
import { NewsTable } from './entities/news.entity'
import { NewsColumnTable } from './entities/news-column.entity'

@Injectable()
export class NewsService {
  constructor(
    // 注入 - 新闻表
    @InjectRepository(NewsTable)
    private readonly newsTable: Repository<NewsTable>,
    // 注入 - 草稿表
    @InjectRepository(NewsDraftTable)
    private readonly newsDraftTable: Repository<NewsDraftTable>,
    // 注入 - 新闻专栏表
    @InjectRepository(NewsColumnTable)
    private readonly newsColumnTable: Repository<NewsColumnTable>
  ) {}

  /**
   * 保存参数校验
   */
  async _validateParams(data: SaveNewsDto, validTitle = true) {
    const obj = plainToClass(SaveNewsDto, data)

    const errors = await validate(obj)

    if (errors.length > 0) {
      const errorMsg = Object.values(errors[0].constraints)[0]
      return errorMsg
    }

    // 检查title是否重复
    if (validTitle && data.title) {
      const duplicate = await this.newsTable.findOne({
        where: { title: data.title }
      })
      if (duplicate && duplicate.uuid !== data.uuid) {
        return `${data.title} 已存在`
      }
    }
  }

  /**
   * 初始化公共数据
   */
  _initCommonData(data: SaveNewsDto) {
    if (!data.content) {
      data.content = ''
    }
  }

  /**
   * 更新关系字段column
   */
  async _updateColumn(data: NewsTable | NewsDraftTable, column_id: number) {
    if (column_id) {
      const column = await this.newsColumnTable.findOne({
        where: { id: column_id }
      })
      if (!column) {
        return httpErrorException('column_id 不存在')
      }
      data.column = column
    }
  }

  /**
   * 查询新闻列表
   * @returns type user[] 新闻列表
   */
  async search(query: QueryNewsDto, where = {}) {
    const { page = 1, page_size = 200 } = query
    const [items, total] = await this.newsTable.findAndCount({
      where,
      select: {
        id: true,
        uuid: true,
        title: true,
        news_date: true,
        cover: true,
        update_time: true,
        is_del: true,
        is_show: true,
        is_top: true,
        key_words: true,
        origin: true
      },
      relations: ['column'],
      order: { is_top: 'DESC', news_date: 'DESC' }, // 按新闻时间倒序
      take: page_size, //设置分页条件
      skip: (page - 1) * page_size
    })

    const list = items.map((item) => {
      return {
        ...item,
        update_time: noMsDate(item.update_time)
      }
    })

    return { list, total }
  }

  /**
   * 创建新闻
   * @param createNewsData 入参 - 用户信息
   * @returns response
   */
  async createNews(createNewsData: SaveNewsDto) {
    this._initCommonData(createNewsData)
    // 创建实体CommunityTable实例，并合并入参
    const data = Object.assign(new NewsTable(), createNewsData)
    // 校验参数
    const validRet = await this._validateParams(data)
    if (validRet) {
      return httpErrorException(validRet)
    }

    // 更新关系字段
    await this._updateColumn(data, createNewsData.column_id)

    await this.newsTable.save(data)
    return '创建成功'
  }

  /**
   * 保存草稿
   * @param createNewsData 入参 - 用户信息
   * @returns response
   */
  async saveDraft(createNewsDraftData: SaveNewsDto) {
    this._initCommonData(createNewsDraftData)
    // 创建实体CommunityTable实例，并合并入参
    const data = Object.assign(new NewsDraftTable(), createNewsDraftData)
    // 校验参数
    const validRet = await this._validateParams(data, false)
    if (validRet) {
      return httpErrorException(validRet)
    }

    // 更新关系字段
    await this._updateColumn(data, createNewsDraftData.column_id)

    const ret = await this.newsDraftTable.save(data)
    return { uuid: ret.uuid }
  }

  /**
   * 新闻详情
   * @param id 新闻id
   * @returns 新闻详情
   */
  async findOne(id: number) {
    const item = await this.newsTable.findOne({
      where: { id },
      relations: ['column']
    })
    if (!item) {
      httpErrorException('id 不正确')
    }

    const ret = {
      ...item,
      create_time: noMsDate(item.create_time),
      update_time: noMsDate(item.update_time)
    }
    return ret
  }

  /**
   * 草稿详情
   * @param uuid 草稿 uuid
   * @returns 草稿详情
   */
  async findDraft(uuid: string) {
    const item = await this.newsDraftTable.findOne({
      where: { uuid }
    })
    if (!item) {
      return httpErrorException('uuid 不正确')
    }

    const ret = {
      ...item,
      create_time: noMsDate(item.create_time),
      update_time: noMsDate(item.update_time)
    }
    return ret
  }

  /**
   * 编辑新闻
   * @param editNewsData 新闻数据
   * @returns
   */
  async edit(editNewsData: SaveNewsDto) {
    const id = editNewsData.id
    const item = await this.newsTable.findOne({
      where: { id }
    })

    if (!item) {
      return httpErrorException('id 不存在')
    }

    this._initCommonData(editNewsData)

    const data = Object.assign(item, editNewsData)

    // 校验参数
    const validRet = await this._validateParams(data)
    if (validRet) {
      return httpErrorException(validRet)
    }

    // 更新关系字段
    await this._updateColumn(data, editNewsData.column_id)

    await this.newsTable.save(data)
    return '修改成功'
  }

  /**
   * 修改展示状态
   * @param payload
   */
  async changeVisible(payload: Partial<QueryVisibleDto>) {
    const { uuid, is_show } = payload
    if (!uuid) {
      return httpErrorException('uuid 必传')
    }

    const item = await this.newsTable.findOne({
      where: { uuid }
    })

    if (!item) {
      return httpErrorException('uuid 不存在')
    }

    if (is_show === NEWS_STATUS_ENUM.OFF || is_show === NEWS_STATUS_ENUM.ON) {
      const data = new NewsTable()
      data.is_show = payload.is_show
      await this.newsTable.update({ uuid }, data)
      return null
    } else {
      return httpErrorException('is_show 值不合法')
    }
  }

  /**
   * 删除新闻
   * @param uuid 新闻uuid
   */
  async delNews(uuid: string) {
    await this.newsTable.delete({ uuid })
    console.log('delNews', uuid)
    return null
  }

  /**
   * 获取配置
   */
  async getConfig() {
    const columns = await this.newsColumnTable.find()

    return { columns }
  }
}
