import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { COLUMNS } from 'src/constants/community.constants'
import { COMMUNITY_STATUS_ENUM_LIST } from 'src/enum/community.enum'
import { formatDate } from 'src/utils'
import { httpErrorException } from 'src/utils/handleError'
import { In, Repository } from 'typeorm'

import {
  ModifyCommunityVisibleDto,
  QueryCommunityDto
} from '../dto/community.dto'
import { SaveCommunityDto } from '../dto/save-community.dto'
import { CommunityTable } from '../entities/community.entity'
import { CommunityColumnTable } from '../entities/community-column.entity'
import { CommunityDraftTable } from '../entities/community-draft.entity'
import { CommunityLabelTable } from '../entities/community-label.entity'

@Injectable()
export class CommunityBackendService {
  constructor(
    // 注入 - 社区文化表
    @InjectRepository(CommunityTable)
    private readonly communityTable: Repository<CommunityTable>,
    // 注入 - 草稿表
    @InjectRepository(CommunityDraftTable)
    private readonly communityDraftTable: Repository<CommunityDraftTable>,
    // 注入 - 专栏表
    @InjectRepository(CommunityColumnTable)
    private readonly communityColumnRepository: Repository<CommunityColumnTable>,
    // 注入 - 标签表
    @InjectRepository(CommunityLabelTable)
    private readonly communityLabelRepository: Repository<CommunityLabelTable>
  ) {}

  /**
   * 保存参数校验
   */
  async _validateParams(data: SaveCommunityDto, validTitle = true) {
    const obj = plainToClass(SaveCommunityDto, data)
    const errors = await validate(obj)

    if (errors.length > 0) {
      const errorMsg = Object.values(errors[0].constraints)[0]
      return errorMsg
    }

    // 检查title是否重复
    if (validTitle && data.title) {
      const duplicate = await this.communityTable.findOne({
        where: { title: data.title }
      })
      if (duplicate && duplicate.uuid !== data.uuid) {
        return `${data.title} 已存在`
      }
    }
  }

  initData(data: SaveCommunityDto) {
    /**
     * 在 MySQL 中，BLOB, TEXT, GEOMETRY, 或 JSON 类型的列不能设置默认值
     * 所以这里设置一下默认值
     */
    if (!data.content) {
      data.content = ''
    }
  }

  /**
   * 查询社区文化列表
   * @returns type user[] 社区文化列表
   */
  async search(query: QueryCommunityDto, where = {}, fields = {}) {
    const { page = 1, page_size = 1000 } = query
    const [items, total] = await this.communityTable.findAndCount({
      where,
      select: {
        id: true,
        uuid: true,
        title: true,
        update_time: true,
        is_show: true,
        sort: true,
        content_type: true,
        keywords: true,
        author: true,
        culture_date: true,
        ...fields
      },
      relations: ['labels', 'column'],
      order: { sort: 'ASC' }, // 按SORT排序
      take: page_size, //设置分页条件
      skip: (page - 1) * page_size
    })

    items.sort((a, b) => {
      const columnAIndex = COLUMNS.findIndex(
        (column) => column.ID === a.column.id
      )
      const columnBIndex = COLUMNS.findIndex(
        (column) => column.ID === b.column.id
      )

      if (columnAIndex !== columnBIndex) {
        return columnAIndex - columnBIndex
      }

      return a.sort - b.sort
    })

    const list = items.map((item) => {
      return {
        ...item,
        update_time: formatDate(item.update_time)
      }
    })

    return { list, total }
  }

  /**
   * 创建社区文化
   * @param createData 入参 - 用户信息
   * @returns response
   */
  async create(createData: SaveCommunityDto) {
    this.initData(createData)

    // 创建实体CommunityTable实例，并合并入参
    const data = Object.assign(new CommunityTable(), createData)
    // 校验参数
    const validRet = await this._validateParams(data)
    if (validRet) {
      return httpErrorException(validRet)
    }

    // 查找CommunityColumn实体，并将其赋值给data.column
    data.column = await this.communityColumnRepository.findOne({
      where: { id: createData.columnId }
    })

    // 查找CommunityLabel实体，并将它们赋值给data.labels
    data.labels = await this.communityLabelRepository.find({
      where: { id: In(createData.labelIds) }
    })

    await this.communityTable.save(data)
    return '创建成功'
  }

  /**
   * 保存草稿
   * @param saveDraftData 入参 - 用户信息
   * @returns response
   */
  async saveDraft(saveDraftData: SaveCommunityDto) {
    this.initData(saveDraftData)

    const data = Object.assign(new CommunityDraftTable(), saveDraftData)

    // 校验参数
    const validRet = await this._validateParams(data, false)
    if (validRet) {
      return httpErrorException(validRet)
    }

    // 查找CommunityColumn实体，并将其赋值给data.column
    data.column = await this.communityColumnRepository.findOne({
      where: { id: saveDraftData.columnId }
    })

    // 查找CommunityLabel实体，并将它们赋值给data.labels
    data.labels = await this.communityLabelRepository.find({
      where: { id: In(saveDraftData.labelIds) }
    })

    const ret = await this.communityDraftTable.save(data)
    return { uuid: ret.uuid }
  }

  /**
   * 社区文化详情
   * @param id 社区文化id
   * @returns 社区文化详情
   */
  async findOne(id: number) {
    const item = await this.communityTable.findOne({
      where: { id },
      relations: ['labels', 'column']
    })
    if (!item) {
      httpErrorException('id 不正确')
    }

    const ret = {
      ...item,
      update_time: formatDate(item.update_time)
    }

    return ret
  }

  /**
   * 草稿详情
   * @param uuid 草稿 uuid
   * @returns 草稿详情
   */
  async findDraft(uuid: string) {
    const item = await this.communityDraftTable.findOne({
      where: { uuid }
    })
    if (!item) {
      return httpErrorException('uuid 不正确')
    }

    const ret = {
      ...item,
      update_time: formatDate(item.update_time)
    }
    return ret
  }

  /**
   * 编辑社区文化
   * @param editData 社区文化数据
   * @returns
   */
  async edit(editData: SaveCommunityDto) {
    const uuid = editData.uuid
    const item = await this.communityTable.findOne({
      where: { uuid },
      relations: ['labels', 'column']
    })

    this.initData(editData)

    if (!item) {
      return httpErrorException('uuid 不存在')
    }

    // 合并参数
    const data = Object.assign(item, editData)

    // 校验参数
    const validRet = await this._validateParams(data)
    if (validRet) {
      return httpErrorException(validRet)
    }

    // 处理columnId字段
    if (editData.columnId) {
      const column = await this.communityColumnRepository.findOne({
        where: { id: editData.columnId }
      })
      if (!column) {
        return httpErrorException('columnId 不存在')
      }
      data.column = column
    }

    // 处理labelIds字段
    if (editData.labelIds) {
      const labels = await this.communityLabelRepository.find({
        where: { id: In(editData.labelIds) }
      })
      if (labels.length !== editData.labelIds.length) {
        console.log('一些标签不存在', labels, editData.labelIds)
      }
      data.labels = labels
    }

    await this.communityTable.save(data)
    return '修改成功'
  }

  /**
   * 修改展示状态
   * @param payload
   */
  async changeVisible(payload: Partial<ModifyCommunityVisibleDto>) {
    const { uuid, is_show } = payload
    if (!uuid) {
      return httpErrorException('uuid 必传')
    }

    const item = await this.communityTable.findOne({
      where: { uuid }
    })

    if (!item) {
      return httpErrorException('uuid 不存在')
    }

    if (!COMMUNITY_STATUS_ENUM_LIST.includes(is_show)) {
      throw httpErrorException('is_show 值不合法')
    }

    await this.communityTable.update({ uuid }, { is_show })
  }

  /**
   * 删除社区文化
   * @param uuid 社区文化uuid
   */
  async del(uuid: string) {
    const ret = await this.communityTable.softDelete({ uuid })

    if (ret.affected > 0) {
      return null
    } else {
      return 'Delete failed: No matching record found'
    }
  }

  /**
   * 获取配置
   */
  async getConfig() {
    const columns = await this.communityColumnRepository.find()
    const labels = await this.communityLabelRepository.find()

    return { columns, labels }
  }
}
