/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:41:08
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-28 16:05:02
 */

import { Context } from 'koa'
import { SsoResult } from './../@types/sso'
import AuthJwt from './../middlewares/jwt/auth'
import AppService from '../services/app'
import { createIdHash, createSecretHash } from './../utils/index'
const { appModel, roleModel, menuModel } = require('../models/index')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const sequelize = require('../config/sequelizeBase')
const Joi = require('joi')
export default class UserController {
  /**
   * 获取应用列表
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async getAppList(ctx: Context) {
    const request: any = ctx.request.body
    const userInfo: SsoResult = AuthJwt.verifyUserToken(
      ctx.header.authorization
    )
    const schema = Joi.object({
      username: Joi.string().empty(''),
      pageSize: Joi.number().required(),
      pageNo: Joi.number().required(),
      name: Joi.string().empty(''),
    })
    try {
      await schema.validateAsync(request)
      const appList = await AppService.findList(
        userInfo.username,
        request.name,
        request.pageSize,
        request.pageNo
      )
      ctx.status = 200
      ctx.body = ctx.body = {
        code: 0,
        msg: '查询列表成功',
        data: appList,
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
   * 新增或者更新App
   * @static
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async addApp(ctx: Context) {
    const request: any = ctx.request.body
    const schema = Joi.object({
      appName: Joi.string().required(),
      // appId: Joi.number().required(),
      // appSecret: Joi.string().required(),
      remark: Joi.string().empty(''),
    })
    try {
      await schema.validateAsync(request)
      const isUserExit = await appModel.findOne({
        where: {
          appName: request.appName,
        },
      })
      if (isUserExit) {
        ctx.status = 200
        ctx.body = {
          code: -1,
          msg: '应用已存在',
        }
        return
      }
      await sequelize.transaction(async (t: any) => {
        const appId = createIdHash(request.appName)
        const addResult = await appModel.create(
          {
            ...request,
            appId: appId,
            appSecret: createSecretHash(request.appName),
            updateTime: new Date(),
          },
          { transaction: t }
        )
        // 给子系统初始化管理员
        await roleModel.create(
          {
            roleName: '管理员',
            role: '管理员' + '-' + addResult.id,
            appId: addResult.id,
            remark: '系统管理员',
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
   * 更新应用
   * @static
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async updateApp(ctx: Context) {
    const request: any = ctx.request.body
    const schema = Joi.object({
      id: Joi.number().required(),
      appName: Joi.string().required(),
      remark: Joi.string().empty(''),
    })
    if (request.id) {
      try {
        await schema.validateAsync(request)
        await appModel.update(
          {
            ...request,
            updateTime: new Date(),
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
        msg: 'id为空',
      }
    }
  }
  /**
   * 删除app
   * @static
   * @param {Context} ctx
   * @memberof UserController
   */
  public static async deleteApp(ctx: Context) {
    const request: any = ctx.request.body
    if (request.id > -1) {
      try {
        await sequelize.transaction(async (t: any) => {
          await appModel.destroy({
            where: {
              id: request.id,
            },
            force: true,
            transaction: t,
          })
          await roleModel.destroy({
            where: {
              appId: request.id,
            },
            force: true,
            transaction: t,
          })
          await menuModel.destroy({
            where: {
              appId: request.id,
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
        msg: 'id为空',
      }
    }
  }
  public static async findIdByAppId(ctx: Context) {
    const { appId } = ctx.params
    try {
      const appObject = await appModel.findOne({
        where: {
          appId: appId,
        },
      })
      if (appObject) {
        ctx.status = 200
        ctx.body = {
          code: 0,
          data: {
            id: appObject.id,
          },
          msg: '查询成功',
        }
        return
      }
    } catch (error) {
      console.log(error)
      ctx.status = 200
      ctx.body = {
        code: -1,
        msg: error.message || '删除失败',
      }
    }
  }
}
