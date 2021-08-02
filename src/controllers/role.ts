/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:40:55
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-26 19:42:51
 */

import { Context } from 'koa'
const { roleMenuModel, roleModel, userRoleModel } = require('../models/index')
const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')
const { Op } = Sequelize
const Joi = require('joi')
export default class RoleController {
  /**
   * 获取角色列表
   * @static
   * @param {Context} ctx
   * @memberof RoleController
   */
  public static async getRoleList(ctx: Context) {
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
      const roleList = await roleModel.findAll({
        attributes: [
          'id',
          'roleName',
          'role',
          'remark',
          [Sequelize.fn('GROUP_CONCAT', Sequelize.col('menu_id')), 'menuId'],
        ],
        include: [
          {
            model: roleMenuModel,
            attributes: [],
            // offset: request.pageSize * (request.pageNo - 1),
            // limit: request.pageSize,
          },
        ],
        where: {
          roleName: {
            [Op.like]: `%${request.name}%`,
          },
          appId: {
            [Op.or]: [appId],
          },
        },
        group: 'id',
        // offset: request.pageSize * (request.pageNo - 1),
        // limit: request.pageSize,
        // raw: true,
      })
      ctx.status = 200
      ctx.body = {
        code: 0,
        msg: '查询成功',
        data: {
          total: roleList && roleList.length,
          rows: roleList,
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
   * 获取所有角色
   * @static
   * @param {Context} ctx
   * @memberof RoleController
   */
  public static async getAllRoleList(ctx: Context) {
    const { appId } = ctx.params
    const schema = Joi.object({
      appId: Joi.number().required(),
    })
    try {
      await schema.validateAsync({ appId })
      const roleList = await roleModel.findAll({
        attributes: [
          'id',
          'roleName',
          'role',
          'remark',
          [Sequelize.fn('GROUP_CONCAT', Sequelize.col('menu_id')), 'menuId'],
        ],
        include: [
          {
            model: roleMenuModel,
            attributes: [],
            // offset: request.pageSize * (request.pageNo - 1),
            // limit: request.pageSize,
          },
        ],
        where: {
          appId: {
            [Op.or]: [appId],
          },
        },
        group: 'id',
      })
      ctx.status = 200
      ctx.body = {
        code: 0,
        msg: '查询成功',
        data: roleList,
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
   * 新增角色
   * @static
   * @param {Context} ctx
   * @memberof RoleController
   */
  public static async add(ctx: Context) {
    const request: any = ctx.request.body
    const schema = Joi.object({
      roleName: Joi.string().required(),
      appId: [Joi.number(), Joi.string()],
      remark: Joi.string().empty(''),
      menuIds: Joi.string().empty(''),
    })
    try {
      await schema.validateAsync(request)
      const isRoleExit = await roleModel.findOne({
        where: {
          role: request.roleName,
          appId: request.appId,
        },
      })

      if (isRoleExit) {
        ctx.status = 200
        ctx.body = {
          code: 0,
          msg: '角色已存在',
        }
        return
      }
      await sequelize.transaction(async (t: any) => {
        const addRoleResult = await roleModel.create(
          {
            roleName: request.roleName,
            role: request.roleName + '-' + request.appId,
            appId: request.appId,
            remark: request.remark,
          },
          { transaction: t }
        )
        const arr =
          request.menuIds &&
          request.menuIds.split(',').map((item: any) => {
            return {
              roleId: addRoleResult.id,
              menuId: item,
            }
          })
        await roleMenuModel.bulkCreate(arr, { transaction: t })
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
        msg: error.message || '新增失败',
      }
    }
  }
  /**
   * 更新角色
   * @static
   * @param {Context} ctx
   * @memberof RoleController
   */
  public static async update(ctx: Context) {
    const request: any = ctx.request.body
    const schema = Joi.object({
      roleName: Joi.string().required(),
      appId: [Joi.number(), Joi.string()],
      remark: Joi.string().empty(''),
      menuIds: Joi.string().empty(''),
      id: Joi.number().required(),
    })
    if (request.id) {
      try {
        await schema.validateAsync(request)
        await sequelize.transaction(async (t: any) => {
          await roleModel.update(
            {
              roleName: request.roleName,
              remark: request.remark || '',
            },
            {
              where: {
                id: request.id,
              },
              transaction: t,
            }
          )
          await roleMenuModel.destroy({
            where: {
              roleId: request.id,
            },
            force: true,
            transaction: t,
          })
          const arr =
            request.menuIds &&
            request.menuIds.split(',').map((item: number) => {
              return {
                roleId: request.id,
                menuId: item,
              }
            })
          await roleMenuModel.bulkCreate(arr, { transaction: t })
        })
        ctx.status = 200
        ctx.body = {
          code: 0,
          message: '修改成功',
        }
      } catch (error) {
        console.error(error)
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: error.message,
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
   * 删除角色
   * @static
   * @param {Context} ctx
   * @memberof RoleController
   */
  public static async deleteRole(ctx: Context) {
    const request: any = ctx.request.body

    try {
      await sequelize.transaction(async (t: any) => {
        await roleModel.destroy({
          where: {
            id: request.id,
          },
          force: true,
          transaction: t,
        })
        await roleMenuModel.destroy({
          where: {
            roleId: request.id,
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
   * 角色关联用户
   * @static
   * @param {Context} ctx
   * @memberof RoleController
   */
  public static async associatedUsers(ctx: Context) {
    const request: any = ctx.request.body
    const schema = Joi.object({
      appId: Joi.number().required(),
      roleId: Joi.number().required(),
      userIds: Joi.string().empty(''),
    })
    if (request.appId) {
      try {
        await schema.validateAsync(request)
        await sequelize.transaction(async (t: any) => {
          await userRoleModel.destroy({
            where: {
              roleId: request.roleId,
            },
            force: true,
            transaction: t,
          })
          const arr = request.userIds.split(',').map((item: number) => {
            return {
              roleId: request.roleId,
              userId: item,
            }
          })
          await userRoleModel.bulkCreate(arr, { transaction: t })
        })
        ctx.status = 200
        ctx.body = {
          code: 0,
          message: '修改成功',
        }
      } catch (error) {
        console.error(error)
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: error.message,
        }
      }
    } else {
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: 'appId为空',
      }
    }
  }
  /**
   * 根据角色查关联的用户
   * @static
   * @param {Context} ctx
   * @memberof RoleController
   */
  public static async getUsersByRole(ctx: Context) {
    const request: any = ctx.request.body
    const schema = Joi.object({
      appId: Joi.number().required(),
      roleId: Joi.number().required(),
    })
    try {
      await schema.validateAsync(request)
      const userIds = await userRoleModel.findAll({
        attributes: ['userId'],
        where: {
          roleId: request.roleId,
        },
      })
      ctx.status = 200
      ctx.body = {
        code: 0,
        msg: '查询成功',
        data: userIds,
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
}
