import { Injectable } from '@nestjs/common'
import { NEWS_STATUS_ENUM } from 'src/enum/news.enum'

import { QueryNewsDto } from '../news/dto/query.dto'
import { NewsService } from '../news/news.service'
import { NewsTable } from '../news/entities/news.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { isValid } from 'src/utils'

@Injectable()
export class NewsToCService {
  constructor(
    private readonly newsService: NewsService,

    /** 注入新闻表 */
    @InjectRepository(NewsTable)
    private readonly newsTable: Repository<NewsTable>
  ) {}

  /** 新闻列表，支持分页 */
  async search(query: QueryNewsDto) {
    const { page = 1, page_size = 200 } = query

    let queryBuilder = this.newsTable
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.column', 'column')
      .where('news.is_show = :is_show', {
        is_show: NEWS_STATUS_ENUM.ON
      })
      .select([
        'news.id',
        'news.uuid',
        'news.title',
        'news.news_date',
        'news.cover',
        'news.is_del',
        'news.is_show',
        'news.is_top',
        'news.key_words',
        'news.origin',
        'column.id',
        'column.name'
      ])
      .orderBy('news.is_top', 'DESC')
      .addOrderBy('news.news_date', 'DESC')
      .skip((page - 1) * page_size)
      .take(page_size)

    // 如果有label_id且有效，添加label_id过滤条件
    if (query.column_id && isValid(query.column_id)) {
      queryBuilder = queryBuilder.andWhere('column.id = :column_id', {
        column_id: Number(query.column_id)
      })
    }

    const [list, total] = await queryBuilder.getManyAndCount()

    return { list, total }
  }

  /** 新闻详情 */
  findOne(id: number) {
    return this.newsService.findOne(id)
  }

  /** 新闻预览 */
  async preview(uuid: string) {
    return this.newsService.findDraft(uuid)
  }

  /** 获取配置 */
  async getConfig() {
    const config = await this.newsService.getConfig()

    return config
  }
}
