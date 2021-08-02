import FormData from 'form-data'
import axios from 'axios'
import config from '../middlewares/sso/config/index'
import Md5 from 'js-md5'
import { SsoData, SsoResult } from '../@types/sso'
import { ssoTokenUrl, ssoUserInfoUrl } from '../config/constant'
const InitializationData = require('../config/initData')
const { appModel, userModel, userRoleModel } = require('../models/index')

export default class AuthService {
  /**
   * 校验appId是否存在于系统
   * @static
   * @param {string} appId
   * @return {string}
   * @memberof AuthService
   */
  public static async getAppSecret(appId: string): Promise<string> {
    try {
      const result = await appModel.findOne({
        attributes: ['appSecret'],
        where: {
          appId: appId,
        },
      })
      if (result) {
        return result.dataValues && result.dataValues.appSecret
      } else {
        return ''
      }
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 校验用户是否在系统注册
   * @static
   * @param {string} username
   * @return {string}
   * @memberof AuthService
   */
  public static async isSign(username: string): Promise<boolean> {
    try {
      const result = await userModel.findOne({
        attributes: ['userName'],
        where: {
          userName: username,
        },
      })
      if (result) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 注册用户
   * @static
   * @param {SsoResult} userInfo
   * @memberof AuthService
   */
  public static async register(userInfo: SsoResult) {
    const newUser = await userModel.create({
      email: userInfo.email || '',
      name: userInfo.name || '',
      userName: userInfo.username,
      phone: userInfo.phone,
    })
    await userRoleModel.create({
      userId: newUser.id,
      roleId: InitializationData.visitorRoleData.id,
    })
  }
  /**
   * 是否有用户，没有则默认第一个为超级管理员
   * @returns
   */
  public static async hasUser(): Promise<boolean> {
    try {
      const userList = await userModel.findAll({
        attributes: ['id'],
      })
      if (userList && userList.length) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 获取token
   * @static
   * @param {string} code
   * @param {string} redirect
   * @return {*}  {Promise<SsoData>}
   * @memberof AuthService
   */
  public static async getTokenByCode(
    code: string,
    redirect: string
  ): Promise<SsoData> {
    try {
      const form = new FormData()
      form.append('grant_type', 'authorization_code')
      form.append('client_id', config.clientID)
      form.append('client_secret', config.clientSecret)
      form.append('redirect_uri', redirect)
      form.append('code', code)

      const res = await axios.post(ssoTokenUrl, form, {
        headers: form.getHeaders(),
      })
      return res.data
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 根据token获取用户信息
   * @static
   * @param {string} token
   * @return {*}  {Promise<SsoResult>}
   * @memberof AuthService
   */
  public static async getSsoUserInfo(token: string): Promise<SsoResult> {
    try {
      // sso用户信息
      const res = await axios.get(ssoUserInfoUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 签名校验
   * @static
   * @param {string} appId
   * @param {string} appSecret
   * @param {string} timestamp
   * @param {string} sign
   * @return {*}  {Promise<boolean>}
   * @memberof AuthService
   */
  public static async checkSignature(
    appSecret: string,
    sign: string,
    params: any
  ): Promise<boolean> {
    const paramsObj = Object.assign({}, params)
    paramsObj.appSecret = appSecret
    let paramsResult = ''
    const paramsKey = Object.keys(paramsObj).sort()
    paramsKey.forEach((key: string) => {
      if (key !== 'sign') {
        paramsResult += paramsObj[key]
      }
    })
    console.log('paramsResult===>', paramsResult)
    const serverSign = Md5(paramsResult)
    return serverSign === sign
  }
}
