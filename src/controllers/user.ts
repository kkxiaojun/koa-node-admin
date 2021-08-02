/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:41:08
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-15 16:39:13
 */

import Joi from 'joi'
import { Context } from 'koa'
import { SsoResult } from './../@types/sso'
import AuthJwt from './../middlewares/jwt/auth'
import config from './../middlewares/sso/config/index'
import UserService from './../services/user'
const {
  userModel,
  userRoleModel,
  appModel,
  roleModel,
} = require('../models/index')
const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')
const { Op } = Sequelize
export default class UserController {
  /**
   * 用户基础信息
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async getUserBase(ctx: Context) {
    const { appId } = ctx.params
    const userInfo: SsoResult = AuthJwt.verifyUserToken(
      ctx.header.authorization
    )
    try {
      const currentUser = await userModel.findOne({
        where: {
          userName: userInfo.username,
        },
      })
      if (!currentUser) {
        throw new Error('用户不存在')
      }
      const appObj = await appModel.findOne({
        attributes: ['id'],
        where: {
          appId: appId,
        },
      })
      const roleIds = await sequelize.query(
        `SELECT a.id, a.role_name, a.role FROM sys_role a
        LEFT JOIN sys_user_role b on a.id=b.role_id
        LEFT JOIN sys_user c on c.id=b.user_id where c.user_name='${userInfo.username}' AND a.app_id='${appObj.dataValues.id}';`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      )
      let menus = []
      if (roleIds && roleIds.length) {
        menus = await sequelize.query(
          `SELECT * from sys_role_menu  a LEFT JOIN sys_menu b ON a.menu_id=b.id where a.role_id=${roleIds[0].id};`,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        )
      }
      ctx.status = 200
      ctx.body = {
        code: 0,
        data: {
          id: currentUser.dataValues.id,
          name: currentUser.dataValues.name,
          userName: currentUser.dataValues.userName,
          roleName: roleIds[0] && roleIds[0].role_name,
          role: roleIds[0] && roleIds[0].role,
          email: currentUser.dataValues.email,
          phone: currentUser.dataValues.phone,
          remark: currentUser.dataValues.remark,
          menus: formatMenus(menus),
        },
      }

      // 记录本次登录的ip和时间
      const time = new Date()
      await userModel.update(
        {
          loginDate: time,
          loginIp: ctx.request.ip,
        },
        {
          where: { id: currentUser.id },
        }
      )
    } catch (error) {
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: error.message,
      }
    }
  }
  /**
   * 获取用户列表
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async getUserList(ctx: Context) {
    const request: any = ctx.request.body
    const { appId } = ctx.params
    const schema = Joi.object({
      name: Joi.string().empty(''),
      pageSize: Joi.number().required(),
      pageNo: Joi.number().required(),
      appId: Joi.number().required(),
    })
    try {
      await schema.validateAsync({ ...request, appId })
      const userList = await UserService.findList(request.name, appId)
      ctx.status = 200
      ctx.body = {
        code: 0,
        msg: '查询用户列表成功',
        data: {
          rows: userList,
          total: userList && userList.length,
        },
      }
    } catch (error) {
      console.log(error)
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: error.message || '查询失败',
      }
    }
  }
  /**
   * 查询所有用户
   * @static
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async getAllUserList(ctx: Context) {
    try {
      const userList = await userModel.findAll({
        attributes: ['id', 'name', 'userName', 'phone', 'email'],
      })
      console.log('userList===', userList)
      ctx.status = 200
      ctx.body = {
        code: 0,
        msg: '查询用户列表成功',
        data: userList,
      }
    } catch (error) {
      console.log(error)
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: error.message || '查询失败',
      }
    }
  }
  /**
   * 新增用户
   * @static
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async addUser(ctx: Context) {
    const request: any = ctx.request.body
    const schema = Joi.object({
      userName: Joi.string().required(),
      name: Joi.string().empty(''),
      appId: [Joi.number(), Joi.string()],
      phone: Joi.number().empty(''),
      roleId: Joi.number().required(),
      email: Joi.string().empty(''),
    })
    // 新增
    try {
      await schema.validateAsync(request)
      const isUserExit = await userModel.findOne({
        where: {
          userName: request.userName,
        },
      })
      if (isUserExit) {
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: '用户已存在',
        }
        return
      }
      await sequelize.transaction(async (t: any) => {
        const newUser = await userModel.create(
          {
            email: request.email || '',
            name: request.name || '',
            userName: request.userName,
            phone: request.phone,
          },
          { transaction: t }
        )
        await userRoleModel.create(
          {
            userId: newUser.id,
            roleId: request.roleId,
          },
          { transaction: t }
        )
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
        msg: error.message || '添加失败',
      }
    }
  }
  /**
   * 更新用户
   * @static
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async updateUser(ctx: Context) {
    const request: any = ctx.request.body
    if (request.id) {
      try {
        await sequelize.transaction(async (t: any) => {
          await userModel.update(
            {
              email: request.email || '',
              name: request.name || '',
              userName: request.userName,
              phone: request.phone,
            },
            {
              where: {
                id: request.id,
              },
            }
          )
          const userRole = await userRoleModel.findAll({
            where: {
              userId: request.id,
            },
          })
          const appRole = await roleModel.findAll({
            where: {
              appId: request.appId,
            },
          })
          let roleId = request.roleId
          for (let index = 0; index < appRole.length; index++) {
            for (let ele = 0; ele < userRole.length; ele++) {
              if (appRole[index].id === userRole[ele].roleId) {
                roleId = userRole[ele].roleId
                break
              }
            }
          }
          await userRoleModel.destroy({
            where: {
              roleId: roleId,
              userId: request.id,
            },
            force: true,
            transaction: t,
          })
          await userRoleModel.create(
            {
              roleId: request.roleId,
              userId: request.id,
            },
            { transaction: t }
          )
        })
        ctx.status = 200
        ctx.body = {
          code: 0,
          msg: '修改成功',
        }
      } catch (error) {
        console.log(error)
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: error.message || '修改失败',
        }
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'ID不存在',
      }
    }
  }
  /**
   * 删除用户
   * @static
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async deleteUser(ctx: Context) {
    const request: any = ctx.request.body

    try {
      await sequelize.transaction(async (t: any) => {
        await userModel.destroy({
          where: {
            id: request.id,
          },
          force: true,
          transaction: t,
        })
        await userRoleModel.destroy({
          where: {
            userId: request.id,
            roleId: request.roleId,
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
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: error.message || '删除失败',
      }
    }
  }
  /**
   * 登出
   * @static
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async logout(ctx: Context) {
    const authToken = ctx.cookies.get(config.cookiekey.authToken)
    if (!authToken) {
      ctx.body = {
        ret: 0,
        msg: '登出成功',
      }
      return
    }
    ctx.cookies.set(config.cookiekey.authToken, '', {
      maxAge: 0,
    })
    ctx.cookies.set(config.cookiekey.accessToken, '', {
      maxAge: 0,
    })
    ctx.body = {
      code: 0,
      msg: '登出成功',
    }
  }
}

interface UserData {
  name?: string
  roleId?: string
  pageNo?: string
  pageSize?: string
}

/**
 * 格式化菜单
 * @param {*} menus
 * @param {number} id
 * @return {*}
 */
function formatMenus(menus: any, id?: number) {
  const newMenus: Array<any> = []
  // 查子级
  if (id) {
    menus.forEach((item: any) => {
      if (item.parent_id === id) {
        newMenus.push({
          isShow: item.is_show,
          path: item.router,
          routes: formatMenus(menus, item.id),
          name: item.name,
        })
      }
    })
  } else {
    menus.forEach((item: any) => {
      if (item.parent_id === 0) {
        newMenus.push({
          isShow: item.is_show,
          path: item.router,
          routes: formatMenus(menus, item.id),
          name: item.name,
        })
      }
    })
  }
  return newMenus
}
