import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 社区标签实体
 */
@Entity({ name: 'community_label' })
export class CommunityLabelTable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 20, comment: '标签名称' })
  name: string
}
