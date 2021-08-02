/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:40:39
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-28 16:05:59
 */

import { Context } from 'koa'
import AddressIP from 'ip'
import { SsoData, SsoResult } from '../@types/sso'
import { ssoAuthorizeUrl } from '../config/constant'
import JwtAuth from '../middlewares/jwt/auth'
import config from '../middlewares/sso/config/index'
import AuthService from '../services/auth'
import Joi from 'joi'
const queryString = require('query-string')

const {
  appModel,
  userModel,
  roleMenuModel,
  menuModel,
  roleModel,
  userRoleModel,
} = require('../models/index')
const sequelize = require('../config/sequelizeBase')
import { PORT } from '../config/constant'
const InitializationData = require('../config/initData')
export default class AuthController {
  /**
   * 授权获取token
   * @param {Context} ctx
   * @memberof AuthController
   */
  public static async authorize(ctx: Context) {
    const { appId, sign, redirect_uri } = ctx.request.query
    const params: any = ctx.request.query
    const schema = Joi.object({
      appId: Joi.string().required(),
      redirect_uri: Joi.string().required(),
      timestamp: Joi.string().required(),
      sign: Joi.string().required(),
    })
    try {
      await schema.validateAsync(ctx.request.query)
      const hasUser = await AuthService.hasUser()
      if (hasUser) {
        console.log('redirect====>', redirect_uri)
        // 1. 数据库比对，是否有注册, 有则返回appSecret
        const appSecret = await AuthService.getAppSecret(String(appId))
        // 2. 签名校验
        const checkSign = await AuthService.checkSignature(
          appSecret,
          String(sign),
          params
        )
        if (!checkSign) {
          ctx.body = {
            code: -1,
            message: 'sign签名验证失败',
          }
          return
        }
      }
      // 进行sso登陆，然后返回sso token
      ctx.session.appId = appId
      ctx.response.redirect(
        ssoAuthorizeUrl +
          `&client_id=${appId}&redirect_uri=http://${AddressIP.address()}:${PORT}/v1/oauth2/auth?redirect=${redirect_uri}`
      )
    } catch (error) {
      console.log(error)
      ctx.status = 200
      ctx.body = {
        code: -1,
        message: error.message || '验证失败',
      }
    }
  }
  /**
   * sso回调，获取code
   * @static
   * @param {Context} ctx
   * @memberof AuthController
   */
  public static async auth(ctx: Context) {
    const { code: oauthCode, error, redirect } = ctx.query
    if (!oauthCode || error) {
      ctx.status = 401
      return
    }
    const appId: string = ctx.session.appId
    try {
      // sso返回的数据
      const ssoData: SsoData = await AuthService.getTokenByCode(
        String(oauthCode),
        String(redirect)
      )
      // sso用户信息
      const userInfo: SsoResult = await AuthService.getSsoUserInfo(
        ssoData.access_token || ''
      )
      const hasUser = await AuthService.hasUser()
      // 1. 第一个进入的用户为超级管理员
      if (!hasUser) {
        await AuthController.initAdminData(appId, userInfo)
      }
      // 未注册的用户
      const isUserSign = await AuthService.isSign(userInfo && userInfo.username)
      if (!isUserSign) {
        // sso用户自动注册
        await AuthService.register(userInfo)
      }
      // 结合ssotoken，生成新token
      const sysToken = JwtAuth.signUserToken(
        {
          username: userInfo.username || '',
          accessToken: ssoData.access_token || '',
        },
        { expiresIn: 24 * 60 * 60 } // 24 * 60 * 60 s
      )
      // cookie配置
      const cookieConfig = {
        httpOnly: false,
        maxAge: (ssoData.expires_in || 18000) * 1000,
        // domain: 'http://192.168.56.113:5000',
      }
      console.log('config.cookiekey.authToken===>', ssoData)
      ctx.cookies.set(config.cookiekey.authToken, sysToken, cookieConfig)
      ctx.cookies.set(
        config.cookiekey.accessToken,
        ssoData.access_token,
        cookieConfig
      )
      if (redirect) {
        ctx.response.header.accessToken = sysToken
        const queryUrl = queryString.stringifyUrl({
          url: redirect,
          query: {
            xl_auth_token: sysToken,
          },
        })
        ctx.redirect(queryUrl)
        return
      }
      ctx.body = {
        code: 0,
        msg: '认证成功',
        data: ssoData,
      }
    } catch (error) {
      if (error.response && error.response.status) {
        ctx.status = error.response.status
        return
      }
      ctx.body = {
        code: -1,
        msg: '服务内部错误',
        error: error.message,
      }
      return
    }
  }
  /**
   * 获取token
   * @static
   * @param {Context} ctx
   * @memberof AuthController
   */
  public static async getToken(ctx: Context) {
    try {
      const authToken = ctx.cookies.get(config.cookiekey.authToken)
      const accessToken = ctx.cookies.get(config.cookiekey.accessToken)
      if (authToken) {
        ctx.status = 200
        ctx.body = {
          code: 0,
          data: {
            authToken,
            accessToken,
          },
        }
      } else {
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: '认证失败',
        }
      }
    } catch (error) {
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: error.message,
      }
    }
  }
  /**
   * 系统还没有用户时，初始化超级管理员及部分数据, 呜呜呜
   * @static
   * @param {string} [appId='']
   * @param {SsoResult} userInfo
   * @memberof AuthController
   */
  static async initAdminData(appId = '', userInfo: SsoResult) {
    // 1. 注册当前应用
    const curApp = await appModel.create({
      appId: appId,
      appSecret: InitializationData.appData.appSecret,
      appName: InitializationData.appData.appName,
      remark: InitializationData.appData.remark,
    })
    // 2. 增加初始菜单数据
    const curMenu = await menuModel.create({
      appId: curApp.id,
      name: InitializationData.menuData[0].name,
      router: InitializationData.menuData[0].router,
      resourceType: InitializationData.menuData[0].resourceType,
      parentId: InitializationData.menuData[0].parentId,
      code: InitializationData.menuData[0].code,
      isShow: InitializationData.menuData[0].isShow,
    })
    const curMenuChild = await menuModel.create({
      appId: curApp.id,
      name: InitializationData.menuData[1].name,
      router: InitializationData.menuData[1].router,
      resourceType: InitializationData.menuData[1].resourceType,
      parentId: curMenu.id,
      code: InitializationData.menuData[1].code,
      isShow: InitializationData.menuData[1].isShow,
    })
    const adminParentMenu = await menuModel.create({
      appId: curApp.id,
      name: InitializationData.adminParent.name,
      router: InitializationData.adminParent.router,
      resourceType: InitializationData.adminParent.resourceType,
      parentId: InitializationData.adminParent.parentId,
      code: InitializationData.adminParent.code,
      isShow: InitializationData.adminParent.isShow,
    })
    let adminDataArr = Object.assign([], InitializationData.adminData)
    adminDataArr = adminDataArr.map((item: any) => {
      return {
        ...item,
        parentId: adminParentMenu.id,
        appId: curApp.id,
      }
    })
    const adminChildMenu = await menuModel.bulkCreate(adminDataArr)
    let addRoleResult: any = {}
    let visitorResult: any = {}
    let menuIds = [curMenu.id, curMenuChild.id, adminParentMenu.id]
    menuIds = menuIds.concat(adminChildMenu.map((item: any) => item.id))

    await sequelize.transaction(async (t: any) => {
      // 3. 创建超级管理员角色
      addRoleResult = await roleModel.create(
        {
          ...InitializationData.roleData,
          appId: curApp.id,
        },
        { transaction: t }
      )
      // 创建游客角色
      visitorResult = await roleModel.create(
        {
          ...InitializationData.visitorRoleData,
          appId: curApp.id,
        },
        { transaction: t }
      )
      const MenuArr = menuIds.map((menuId: number) => {
        return {
          roleId: addRoleResult.id,
          menuId: menuId,
        }
      })
      await roleMenuModel.bulkCreate(MenuArr, { transaction: t })
    })
    // 4. 添加用户
    const newUser = await userModel.create({
      email: userInfo.email,
      name: userInfo.name,
      userName: userInfo.username,
      phone: userInfo.phone,
    })
    // 5. 用户关联为超级管理员
    await userRoleModel.create({
      userId: newUser.id,
      roleId: addRoleResult.id,
    })
  }
}
