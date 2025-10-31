export interface LoginRequestData {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

export interface LoginResponseData {
  code: number
  msg: string
  data: {
    tokenName: string
    tokenValue: string
    isLogin: boolean
    loginId: string
    loginType: string
    tokenTimeout: number
    sessionTimeout: number
    tokenSessionTimeout: number
    tokenActiveTimeout: number
    loginDeviceType: string
    tag: string | null
  }
}
