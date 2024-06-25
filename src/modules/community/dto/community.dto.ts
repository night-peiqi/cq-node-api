/**
 * 查询列表参数
 */
export class QueryCommunityDto {
  page: number
  page_size: number
  label_id?: number
  keywords?: string
}

/**
 * 修改展示状态
 */
export class ModifyCommunityVisibleDto {
  uuid: string
  is_show: number
}
