import { NEWS_STATUS_ENUM } from 'src/enum/news.enum'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { NewsColumnTable } from './news-column.entity'

@Entity({ name: 'official_website_news' })
@Index(['is_top', 'news_date'])
export class NewsTable {
  @PrimaryGeneratedColumn()
  id: number

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
  @Index({ unique: true })
  title: string

  @Column({ type: 'varchar', length: 255, comment: '新闻封面地址' })
  cover: string

  @Column({ type: 'varchar', length: 50, comment: '新闻日期' })
  news_date: string

  @Column({ type: 'varchar', length: 255, comment: '新闻来源', default: '' })
  origin: string

  @Column({
    default: NEWS_STATUS_ENUM.OFF,
    comment: '是否置顶：0 否，1 是'
  })
  is_top: number

  @Column({
    default: NEWS_STATUS_ENUM.OFF,
    comment: '是否删除：0 否，1 是'
  })
  is_del: number

  @Column({
    default: NEWS_STATUS_ENUM.OFF,
    comment: '是否展示：0 否，1 是'
  })
  is_show: number

  @Column({ type: 'text', comment: '新闻内容' })
  content: string

  @Column({ type: 'varchar', length: 255, comment: '关键词', default: '' })
  key_words: string

  @ManyToOne(() => NewsColumnTable) // 多对一关系
  @JoinColumn({ name: 'column_id' }) // 外键列名，创建表时，字段名是 column_id
  column: NewsColumnTable // column 是一个关系字段，不是数据库字段，关联查询时用来查询关联表的字段

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
