/**
 * 查询列表参数
 */
export class QueryNewsDto {
  page: number
  page_size: number
  column_id?: number
}

/**
 * 修改展示状态
 */
export class QueryVisibleDto {
  uuid: string
  is_show: number
}
