# 长轻node服务

## 环境
- nodejs 18.18.0

## vscode 插件要求

通过vscode打开项目时会提示安装

- eslint
- prettier

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## File Introduction

- constants 常量
- db 数据库相关配置
- enum 枚举
- guard 路由守卫
- middlewares 中间件
- modules 模块
  - module.ts 定义和配置模块
  - controller.ts 接口路由和请求处理程序
  - service.ts 业务逻辑，用于处理数据、执行操作，以及将数据传递给控制器。
  - entity.ts 视图实体（数据表定义）
  - dto.ts 数据传输类型定义（ts 类型定义）
- utils 工具方法
- ecosystem.config.js 服务启动配置

## Installation

```bash
$ yarn install
```

## commit

```bash
yarn cz

git push
```


## 本地开发

```bash
# 启动mysql服务
mysqld --console

# 运行项目
yarn dev
```

## nest cli妙用
```base
# 快速生成一个 CRUD 模块
# nest generate|g resource|res [name] [path]
nest g res user modules
```

## nest cli妙用
```base
# 快速生成一个 CRUD 模块
# nest generate|g resource|res [name] [path]
nest g res user modules
```
 

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## deploy
1. 把项目代码放到服务器
2. 进入到代码目录
3. 安装依赖：yarn
4. 打包：yarn build
5. 启动服务
   1. 测试环境：pm2 start ecosystem.config.js --env test
   2. 生产环境：pm2 start ecosystem.config.js --env production



### 上线模版

```
【上线环境】：生产环境
【上线名称】：stage-cq-node-api
【上线内容】：
【上线分支】：master
【commit号】：
【上线域名】：https://cq-nodeapi.cqslim.com
【应用范围】：内网
【Gitlab地址】：https://k8s-stage-jenkins.weimiaocaishang.com/job/%E9%95%BF%E8%BD%BB-stage/job/stage-cq-node-api/
【监控URL地址】：https://cq-nodeapi.cqslim.com
【自测结果】：正常
【QA验证】：正常
【产品验收】：正常
【是否对其他功能影响】： 无
```
