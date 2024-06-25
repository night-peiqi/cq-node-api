/** 业务接口 code */
export enum HTTP_CODE_ENUM {
  SUCCESS = 0, // 成功
  ERROR = -1, // 失败
  NO_AUTHENTICATION = 40029 // 登录态失效
}

/** http 状态码 */
export enum HTTP_STATUS_ENUM {
  SUCCESS = 200,
  ERROR = 500
}

/** 环境变量Key */
export enum ENV_KEY_ENUM {
  ENV = 'RUNNING_ENV'
}

/** 环境变量value */
export enum ENV_VALUE_ENUM {
  DEV = 'development',
  TEST = 'test',
  PROD = 'production'
}
