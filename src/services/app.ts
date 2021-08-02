const { appModel } = require('../models/index')
const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')
const { Op } = Sequelize
const InitData = require('../config/initData')
export default class AppService {
  /**
   * 查找app列表
   * @static
   * @param {string} username
   * @param {string} [appName='']
   * @param {number} [pageSize=10]
   * @param {number} [pageNo=1]
   * @return {*}
   * @memberof AppService
   */
  public static async findList(
    username: string,
    appName = '',
    pageSize = 10,
    pageNo = 1
  ) {
    try {
      const roleList = await sequelize.query(
        `SELECT a.app_id, a.is_super FROM sys_role a
        LEFT JOIN sys_user_role b on a.id=b.role_id 
        LEFT JOIN sys_user c on c.id=b.user_id where c.user_name='${username}';`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      )

      let isSuper = false
      // 是否是超级管理员
      if (roleList && roleList.length) {
        if (!!roleList[0].is_super) {
          isSuper = true
        }
      }
      const roleIds = roleList.map((item: { app_id: string }) => item.app_id)
      if (isSuper) {
        const appList = await appModel.findAndCountAll({
          attributes: ['id', 'appId', 'appName', 'appSecret', 'remark'],
          where: {
            appName: {
              [Op.like]: `%${appName}%`,
            },
            appId: {
              [Op.ne]: InitData.appData.appId,
            },
          },
          order: [['updateTime', 'DESC']],
          offset: pageSize * (pageNo - 1),
          limit: pageSize,
          raw: true,
        })
        return appList
      } else {
        const appList = await appModel.findAndCountAll({
          attributes: ['id', 'appId', 'appName', 'appSecret', 'remark'],
          where: {
            appName: {
              [Op.like]: `%${appName}%`,
            },
            id: {
              [Op.or]: roleIds,
            },
            appId: {
              [Op.ne]: InitData.appData.appId,
            },
          },
          order: [['updateTime', 'DESC']],
          offset: pageSize * (pageNo - 1),
          limit: pageSize,
          raw: true,
        })
        return appList
      }
    } catch (error) {
      console.log(error)
    }
  }
}
