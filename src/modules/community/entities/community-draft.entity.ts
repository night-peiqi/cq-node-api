import { COMMUNITY_STATUS_ENUM } from 'src/enum/community.enum'
import {
  Column,
  Entity,
  Generated,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { CommunityColumnTable } from './community-column.entity'
import { CommunityLabelTable } from './community-label.entity'

/**
 * 社区文化-草稿实体
 */
@Entity({ name: 'community_culture_draft' })
@Index(['id', 'uuid'])
export class CommunityDraftTable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'uuid' })
  @Generated('uuid')
  uuid: string

  @Column({ type: 'varchar', length: 100, comment: '标题' })
  title: string

  @Column({ type: 'varchar', length: 100, comment: '简介' })
  subtitle: string

  @Column({ type: 'varchar', length: 100, comment: '关键词', default: '' })
  keywords: string

  @Column({ type: 'varchar', length: 100, comment: '作者', default: '' })
  author: string

  @Column({
    type: 'varchar',
    length: 100,
    comment: '文化日期',
    default: ''
  })
  culture_date: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '封面图链接'
  })
  cover: string

  @Column({ type: 'varchar', length: 20, comment: '内容类型' })
  content_type: string

  @Column({ type: 'text', comment: '富文本内容' })
  content: string

  @Column({ type: 'varchar', length: 50, comment: '视频名称' })
  video_name: string

  @ManyToOne(() => CommunityColumnTable)
  column: CommunityColumnTable

  @ManyToMany(() => CommunityLabelTable)
  @JoinTable({ name: 'community_draft_community_label' }) // 多对多时，创建联接表
  labels: CommunityLabelTable[]

  @Column({
    type: 'tinyint',
    default: COMMUNITY_STATUS_ENUM.OFF,
    comment: '上下架状态，0 表示下架，1 表示上架'
  })
  is_show: number

  @Column({ type: 'tinyint', default: 0, comment: '是否删除，0 否，1 是' })
  is_del: number

  @Column({ type: 'tinyint', default: 0, comment: '排序' })
  sort: number

  @UpdateDateColumn({ comment: '更新时间，每次更新记录时自动设置为当前时间' })
  update_time: Date
}
