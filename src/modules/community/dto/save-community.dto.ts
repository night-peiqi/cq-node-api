import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SaveCommunityDto {
  @IsOptional() // 可选
  uuid?: string

  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string

  @IsString()
  @IsNotEmpty({ message: '简介不能为空' })
  subtitle: string

  @IsString()
  @IsNotEmpty({ message: '封面不能为空' })
  cover: string

  @IsString()
  @IsNotEmpty({ message: '内容类型不能为空' })
  content_type?: string

  @IsString()
  content?: string

  @IsNotEmpty({ message: '专栏id不能为空' })
  columnId: number

  @IsArray({ message: '标签必须为数组' })
  @IsNotEmpty({ message: '标签不能为空' })
  labelIds: number[]

  @IsOptional()
  is_show?: number

  @IsNotEmpty({ message: '排序不能为空' })
  sort: number

  @IsOptional()
  video_name?: ''
}
