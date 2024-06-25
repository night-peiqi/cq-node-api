import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DbEnum } from 'src/enum/db.enum'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: configService.get(DbEnum.DB_TYPE),
          host: configService.get(DbEnum.DB_HOST),
          port: configService.get(DbEnum.DB_PORT),
          username: configService.get(DbEnum.DB_USERNAME),
          password: configService.get(DbEnum.DB_PASSWORD),
          database: configService.get(DbEnum.DB_DATABASE),
          // entities: [User, Profile, Logs, Roles],
          // 同步本地的schema与数据库 -> 不可在生产中使用，否则可能会丢失生产数据。
          synchronize: configService.get(DbEnum.DB_SYNC),
          autoLoadEntities: true,
          logging: process.env.NODE_ENV === 'development'
        } as TypeOrmModuleOptions
      }
    })
  ]
})
export class DbModule {}
