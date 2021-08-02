/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:40:45
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-28 18:13:25
 */

import { Context } from 'koa'
import { formatMenus } from '../utils'
import { readFile, unlink } from 'fs/promises'
import MenuService from '../services/menu'
import { MenuData } from '../@types/menu'
const { menuModel, roleMenuModel } = require('../models/index')
const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')
const { Op } = Sequelize
const Joi = require('joi')
export default class MenuController {
  /**
   * 菜单
   * @static
   * @param {Context} ctx
   * @memberof MenuController
   */
  public static async getMenu(ctx: Context) {
    const { appId } = ctx.params
    try {
      const menuList = await menuModel.findAndCountAll({
        where: {
          appId: {
            [Op.or]: [appId],
          },
        },
      })
      const result = formatMenus(menuList.rows)
      ctx.status = 200
      ctx.body = {
        code: 0,
        data: result,
        msg: '成功',
      }
    } catch (error) {
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: error.message || '查询失败',
      }
    }
  }
  /**
   * 菜单列表
   * @static
   * @param {Context} ctx
   * @memberof MenuController
   */
  public static async getMenuList(ctx: Context) {
    const request: any = ctx.request.body
    const { appId } = ctx.params
    const schema = Joi.object({
      name: Joi.string().empty(''),
      pageSize: Joi.number().required(),
      pageNo: Joi.number().required(),
    })
    try {
      await schema.validateAsync(request)
      const menuList = await menuModel.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${request.name || ''}%`,
          },
          appId: {
            [Op.or]: [appId],
          },
        },
        offset: request.pageSize * (request.pageNo - 1),
        limit: request.pageSize,
        raw: true,
      })
      menuList.total = menuList.count
      menuList.rows = formatMenus(menuList.rows)
      delete menuList.count
      ctx.status = 200
      ctx.body = {
        code: 0,
        data: menuList,
        msg: '成功',
      }
    } catch (error) {
      console.log(error)
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: error.message,
      }
    }
  }
  /**
   * 新增菜单
   * @static
   * @param {Context} ctx
   * @memberof MenuController
   */
  public static async add(ctx: Context) {
    const request: any = ctx.request.body
    const schema = Joi.object({
      router: Joi.string().empty(''),
      name: Joi.string().required(),
      isShow: Joi.number().required(),
      parentId: Joi.number().required(),
      appId: Joi.number().required(),
      code: Joi.string().empty(''),
    })
    try {
      await schema.validateAsync(request)
      const isUserExit = await menuModel.findOne({
        where: {
          code: request.code,
          appId: request.appId,
        },
      })

      if (isUserExit) {
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: '菜单编码已存在',
        }
        return
      }
      await menuModel.create({
        ...request,
        code: request.name + '-' + request.appId,
      })
      ctx.status = 200
      ctx.body = {
        code: 0,
        msg: '添加成功',
      }
    } catch (error) {
      console.log(error)
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: (error && error.message) || '添加失败',
      }
    }
  }
  public static async update(ctx: Context) {
    const request: any = ctx.request.body
    if (request.id) {
      try {
        await menuModel.update(
          {
            ...request,
          },
          {
            where: {
              id: request.id,
            },
          }
        )
        ctx.status = 200
        ctx.body = {
          code: 0,
          msg: '修改成功',
        }
      } catch (error) {
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: '修改失败',
        }
      }
    } else {
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: 'id为空',
      }
    }
  }
  /**
   * 删除菜单
   * @static
   * @param {Context} ctx
   * @memberof MenuController
   */
  public static async delete(ctx: Context) {
    const request: any = ctx.request.body
    if (request.id > -1) {
      try {
        await sequelize.transaction(async (t: any) => {
          await menuModel.destroy({
            where: {
              id: request.id,
            },
            force: true,
            transaction: t,
          })
          await roleMenuModel.destroy({
            where: {
              menuId: request.id,
            },
            force: true,
            transaction: t,
          })
        })

        ctx.status = 200
        ctx.body = {
          code: 0,
          msg: '删除成功',
        }
      } catch (error) {
        console.log(error)
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: error.message || '删除失败',
        }
      }
    } else {
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: 'id不能为空',
      }
    }
  }
  public static async importJson(ctx: Context) {
    const fileObj: any = ctx.request.files.file
    const { appId } = ctx.params
    try {
      // 读取json文件
      const fileData = await readFile(fileObj.path)
      // 转为json string
      const jsonData: MenuData = JSON.parse(fileData.toString())
      // 符合json数组规则，入库
      if (Array.isArray(jsonData)) {
        jsonData.forEach((item) => {
          console.log(item)
        })
        // 根据json数组新增菜单
        await MenuService.addMunus(appId, jsonData)
        ctx.status = 200
        ctx.body = {
          code: 0,
          msg: '新增成功',
        }
        await unlink(fileObj.path)
      } else {
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: 'json结构异常',
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
}
