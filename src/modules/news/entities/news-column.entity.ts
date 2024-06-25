import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 新闻专栏实体
 */
@Entity({ name: 'news_column' })
export class NewsColumnTable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 20, comment: '专栏名称' })
  name: string
}
