import { Menu, MenuData } from '../@types/menu'
const { menuModel } = require('../models/index')
const sequelize = require('../config/sequelizeBase')
export default class MenuService {
  public static async addMunus(appId: string, jsonData: Array<MenuData>) {
    try {
      const menuArr: Array<MenuData> = Object.assign([], jsonData)
      const menuChildMap = new Map()
      for (let index = 0; index < menuArr.length; index++) {
        menuChildMap.set(menuArr[index].router, menuArr[index].childData)
      }
      const parentMenus = menuArr.map((item: MenuData) => {
        return {
          ...item,
          parentId: 0,
          appId: appId,
        }
      })
      await sequelize.transaction(async (t: any) => {
        // 1. 增加父菜单
        const parentMenu = await menuModel.bulkCreate(parentMenus, {
          transaction: t,
        })
        // 2. 增加子菜单
        let childMenus: Array<Menu> = []
        for (let index = 0; index < menuArr.length; index++) {
          if (menuArr[index].childData && menuArr[index].childData.length) {
            // 加parentId和appId参数
            const child = menuArr[index].childData.map((item: MenuData) => {
              return {
                ...item,
                parentId: parentMenu[index].id,
                appId: appId,
              }
            })
            childMenus = childMenus.concat(child)
          }
        }
        await menuModel.bulkCreate(childMenus, { transaction: t })
      })
    } catch (error) {
      console.log(error)
    }
  }
}
