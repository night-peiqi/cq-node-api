import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { COMMUNITY_STATUS_ENUM } from 'src/enum/community.enum'
import { isValid } from 'src/utils'
import { Brackets, Repository } from 'typeorm'

import { CommunityBackendService } from '../backend-module/community.service'
import { QueryCommunityDto } from '../dto/community.dto'
import { CommunityTable } from '../entities/community.entity'

@Injectable()
export class CommunityClientService {
  constructor(
    private readonly backendService: CommunityBackendService,

    @InjectRepository(CommunityTable)
    private readonly communityTable: Repository<CommunityTable>
  ) {}

  /**
   * 创建查询构建器
   */
  private createQueryBuilder() {
    return (
      this.communityTable
        // 创建查询构建器（用于链式调用）并设置别名为 community
        .createQueryBuilder('community')
        /**
         * 左连接
         * params1: 关系属性名，左表(community)中定义的关系字段名，在 entity 中已经定义了表关系
         * params2: 右表别名，在后面方法中需要引用右表时使用
         */
        .leftJoinAndSelect('community.labels', 'label')
        .leftJoinAndSelect('community.column', 'column')
        .where('community.is_show = :is_show', {
          is_show: COMMUNITY_STATUS_ENUM.ON
        })
        .select([
          'community.id',
          'community.uuid',
          'community.title',
          'community.subtitle',
          'community.cover',
          'community.content_type',
          'community.sort',
          'community.is_show',
          'community.update_time',
          'community.keywords',
          'community.author',
          'community.culture_date',
          'label.id',
          'label.name',
          'column.id',
          'column.name'
        ])
        .orderBy('community.sort', 'ASC')
    )
  }

  /**
   * 查询社区文化列表
   * @returns type user[] 社区文化列表
   */
  async search(query: QueryCommunityDto) {
    let queryBuilder = this.createQueryBuilder()

    // 如果有关键字，添加关键字搜索条件
    if (query.keywords) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('title LIKE :keywords', { keywords: `%${query.keywords}%` })
            .orWhere('subtitle LIKE :keywords', {
              keywords: `%${query.keywords}%`
            })
            .orWhere('content LIKE :keywords', {
              keywords: `%${query.keywords}%`
            })
        })
      )
    }

    // 如果有label_id且有效，添加label_id过滤条件
    if (query.label_id && isValid(query.label_id)) {
      queryBuilder = queryBuilder.andWhere('label.id = :label_id', {
        label_id: query.label_id
      })
    }

    const [list, total] = await queryBuilder.getManyAndCount()

    return { list, total }
  }

  /**
   * 社区文化详情
   * @param id 社区文化id
   * @returns 社区文化详情
   */
  async findOne(id: number) {
    const ret = await this.backendService.findOne(id)
    return ret
  }

  /**
   * 草稿详情
   * @param uuid 草稿 uuid
   * @returns 草稿详情
   */
  async preview(uuid: string) {
    const ret = await this.backendService.findDraft(uuid)
    return ret
  }

  /**
   * 获取配置
   */
  async getConfig() {
    const config = await this.backendService.getConfig()

    return config
  }
}
