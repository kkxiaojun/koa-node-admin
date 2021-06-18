/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:40:39 
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-06-18 18:04:32
 */

import { Context } from "koa"
import { ssoAuthorizeUrl } from '../config/constant'
import JwtAuth from '../plugin/jwt/auth'
import AuthService from "../service/auth"

class AuthController {
  /**
   * 授权获取token
   * @param {Context} ctx
   * @memberof AuthController
   */
  async authorize(ctx: Context) {
    if (true) {
      const { appId, timestamp, sign } = ctx.request.query
      console.log('authorize===>', ctx.request.query)
      // 1. 数据库比对，是否有注册
      await AuthService.isRegister(String(appId))
      // 2. 有注册则进行sso登陆，然后返回账号系统token
      await 
      // 登陆成功




      // const token = JwtAuth.signUserToken(
      //   {
      //     _id: '133',
      //     name: 'kkk'
      //   },
      //   { expiresIn: 24 * 60 * 60 } // 60 * 60 s
      // );
      // ctx.status = 200
      // ctx.body = {
      //   code: "0",
      //   message: "登录成功",
      //   data: {
      //     token
      //   }
      // }
      ctx.response.redirect(ssoAuthorizeUrl + `&redirect_uri=http://127.0.0.1:4000/xl/api/auth?redirect=http://127.0.0.1:8000/user/login`);
    } else {
      ctx.status = 200
      ctx.body = {
        code: "-1",
        message: "登录失败"
      }
    }
  }
  /**
   * 获取当前系统的菜单
   * @param {Context} ctx
   * @memberof AuthController
   */
  async menulist(ctx: Context) {}
}

const authController = new AuthController()
export { authController }