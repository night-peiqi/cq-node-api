import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 社区专栏实体
 */
@Entity({ name: 'community_column' })
export class CommunityColumnTable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 20, comment: '专栏名称' })
  name: string
}
