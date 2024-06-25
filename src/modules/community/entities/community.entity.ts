import { COMMUNITY_STATUS_ENUM } from 'src/enum/community.enum'
import {
  Column,
  DeleteDateColumn,
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
 * 社区文化实体
 */
@Entity({ name: 'community_culture' })
@Index(['id', 'uuid', 'sort'])
export class CommunityTable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'uuid' })
  @Generated('uuid')
  uuid: string

  @Column({ type: 'varchar', length: 100, comment: '标题' })
  @Index({ unique: true })
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

  @Column({
    type: 'varchar',
    length: 20,
    default: '',
    comment: '内容类型：RICHTEXT 富文本，IMAGE 图片，VIDEO 视频'
  })
  content_type: string

  @Column({ type: 'text', comment: '富文本内容' })
  content: string

  @Column({ type: 'varchar', length: 50, default: '', comment: '视频名称' })
  video_name: string

  /**
   * 关系字段可通过 @JoinColumn({ name: 'column_id' }) 指定外键字段名
   * 这里已经创建了的就不改了，后面再有关系字段，参考 news.entity.ts 的写法
   */
  @ManyToOne(() => CommunityColumnTable) // 多对一关系
  column: CommunityColumnTable

  @ManyToMany(() => CommunityLabelTable) // 多对多关系
  @JoinTable({ name: 'community_community_label' }) // 联接表
  labels: CommunityLabelTable[]

  @Column({
    type: 'tinyint',
    default: COMMUNITY_STATUS_ENUM.OFF,
    comment: '上下架状态，0 表示下架，1 表示上架'
  })
  is_show: number

  @Column({ type: 'tinyint', default: 0, comment: '排序' })
  sort: number

  @UpdateDateColumn({ comment: '更新时间，每次更新记录时自动设置为当前时间' })
  update_time: Date

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    comment: '软删除时间'
  })
  deletedAt: Date
}
