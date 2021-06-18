import jsonwebtoken from 'jsonwebtoken'
import jwt from 'koa-jwt'
const { jwtSecret } =  require("../../config/index")

export interface UserParams {
  _id: string
  name: string
}
export default class JwtAuth {
  /**
   * 获取用户token
   * @static
   * @param {UserParams} userData
   * @param {*} [options]
   * @return {*}  {string}
   * @memberof JwtAuth
   */
  public static signUserToken(userData: UserParams, options?: any): string {
    return jsonwebtoken.sign(userData, jwtSecret, options)
  }

  /**
   * 验证用户token值
   * @static
   * @return {*}  {jwt.Middleware}
   * @memberof JwtAuth
   */
  public static verifyUserToken(): jwt.Middleware {
    return jwt({ secret: jwtSecret })
  }
}
