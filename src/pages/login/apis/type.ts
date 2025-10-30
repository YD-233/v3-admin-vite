export interface LoginRequestData {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

export interface LoginTokenData {
  /** token值 */
  tokenValue: string
}

export type LoginResponseData = ApiResponseData<LoginTokenData>
