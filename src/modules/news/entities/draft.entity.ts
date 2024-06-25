import { NEWS_STATUS_ENUM } from 'src/enum/news.enum'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { NewsColumnTable } from './news-column.entity'

@Entity({ name: 'official_website_news_draft' })
export class NewsDraftTable {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({
    type: 'varchar',
    length: 50,
    comment: '创建人userid',
    default: 123456
  })
  creator_id: string

  @Column({ type: 'varchar', length: 50, comment: '新闻标题' })
  title: string

  @Column({ type: 'varchar', length: 255, comment: '新闻封面地址' })
  cover: string

  @Column({ type: 'varchar', length: 255, comment: '新闻来源' })
  origin: string

  // 这个类型有没有优化空间，需要这个字段排序
  @Column({ type: 'varchar', length: 50, comment: '新闻日期' })
  news_date: string

  @Column({
    type: 'enum',
    enum: [NEWS_STATUS_ENUM.OFF, NEWS_STATUS_ENUM.ON],
    default: NEWS_STATUS_ENUM.OFF,
    comment: '是否置顶：0 否，1 是'
  })
  is_top: number

  @Column({
    type: 'enum',
    enum: [NEWS_STATUS_ENUM.OFF, NEWS_STATUS_ENUM.ON],
    default: NEWS_STATUS_ENUM.OFF,
    comment: '是否删除：0 否，1 是'
  })
  is_del: number

  @Column({
    type: 'enum',
    enum: [NEWS_STATUS_ENUM.OFF, NEWS_STATUS_ENUM.ON],
    default: NEWS_STATUS_ENUM.OFF,
    comment: '是否展示：0 否，1 是'
  })
  is_show: number

  @Column({ type: 'text', comment: '新闻内容' })
  content: string

  @Column({ type: 'text', comment: '关键词' })
  key_words: string

  @ManyToOne(() => NewsColumnTable) // 多对一关系
  @JoinColumn({ name: 'column_id' })
  column: NewsColumnTable

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间'
  })
  create_time: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '最近更新时间'
  })
  update_time: Date
}
