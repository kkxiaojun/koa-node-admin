import { UserData } from '../@types/userdata'

const { appModel } = require('../models/index')
const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')
const { Op } = Sequelize

export default class UserService {
  /**
   * 校验appId是否存在于系统
   * @static
   * @param {string} appId
   * @return {*}
   * @memberof AuthService
   */
  public static async isRegister(appId: string) {
    try {
      const result = await appModel.findOne({
        attributes: ['appId', 'appName'],
        where: {
          appId: appId,
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
   * 查询用户列表
   * @static
   * @param {string} username
   * @param {string} [appName='']
   * @param {number} [pageSize=10]
   * @param {number} [pageNo=1]
   * @return {*}
   * @memberof UserService
   */
  public static async findList(username: string, appId = '') {
    try {
      const appList = await sequelize.query(
        `SELECT a.id, a.email, a.phone, a.login_date as loginDate, a.name, a.user_name as userName,  c.role_name as roleName, c.id as roleId FROM sys_user a
        LEFT JOIN sys_user_role b on a.id=b.user_id 
        LEFT JOIN sys_role c on c.id=b.role_id where (c.app_id='${appId}' AND a.name LIKE '%${username}%');`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      )
      return appList
    } catch (error) {
      console.log(error)
    }
  }
  public static async addService(request: UserData) {
    return true
  }
}
