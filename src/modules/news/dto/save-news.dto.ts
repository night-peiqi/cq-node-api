import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from 'class-validator'
import { NEWS_STATUS_ENUM } from 'src/enum/news.enum'

export class SaveNewsDto {
  @IsString()
  creator_id: string

  @IsOptional() // 可选参数
  id?: number

  @IsOptional() // 可选参数
  uuid?: string

  @IsString()
  @Length(1, 30, { message: '新闻标题最多30个字' })
  @IsNotEmpty({ message: '新闻标题不能为空' })
  title: string

  @IsString({ message: '封面必须是一个图片链接' })
  @IsNotEmpty({ message: '封面必须是一个图片链接' })
  cover: string

  @IsEnum(NEWS_STATUS_ENUM)
  is_top: number

  @IsNotEmpty({ message: '专栏id不能为空' })
  column_id: number

  @IsString({ message: '新闻日期必须是一个日期字符串' })
  @IsNotEmpty({ message: '新闻日期必须是一个日期字符串' })
  news_date: string

  @IsString({ message: '新闻内容必填' })
  @IsNotEmpty({ message: '新闻内容必填' })
  content: string

  @IsOptional()
  key_words: string

  @IsOptional()
  origin: string
}
