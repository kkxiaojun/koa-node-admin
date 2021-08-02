import jsonwebtoken from 'jsonwebtoken'
const { jwtSecret } = require('../../config/index')

export interface UserParams {
  username: string
  name?: string
  avatar?: string
  email?: string
  gender?: number
  phone?: number
  accessToken: string
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
    try {
      return jsonwebtoken.sign(userData, jwtSecret, options)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 验证用户token值
   * @static
   * @param {string} token
   * @return {*}  {Object}
   * @memberof JwtAuth
   */
  public static verifyUserToken(token: string): any {
    try {
      const authorization = token && token.split(' ')[1]
      return jsonwebtoken.verify(authorization, jwtSecret)
    } catch (error) {
      console.log(error)
      throw { code: 401, message: 'no authorization' }
    }
  }
}
