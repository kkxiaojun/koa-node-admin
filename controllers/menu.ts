/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:40:45 
 * @Last Modified by:   zhaoguojun 
 * @Last Modified time: 2021-06-17 17:40:45 
 */

import { Context } from "koa"
import { formatMenus } from "../util"
const { menuModel } = require("../models/index")
const Sequelize = require("sequelize")
const { Op } = Sequelize

export const queryMenu = async (ctx: Context) => {
  try {
    const menuList = await menuModel.findAndCountAll()
    const result = formatMenus(menuList.rows)
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    console.log(error)
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: "查询失败",
    }
  }
}

export const queryMenuList = async (ctx: Context) => {
  try {
    const menuList = await menuModel.findAndCountAll()
    menuList.total = menuList.count
    menuList.rows = formatMenus(menuList.rows)
    delete menuList.count
    ctx.status = 200
    ctx.body = menuList
  } catch (error) {
    console.log(error)
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: "查询失败",
    }
  }
}

export const saveOrUpdateMenu = async (ctx: Context) => {
  const request = ctx.request.body
  // @ts-ignore
  if (request.id) {
    try {
      await menuModel.update(
        {
          // @ts-ignore
          ...request,
        },
        {
          where: {
            // @ts-ignore
            id: request.id,
          },
        }
      )
      ctx.status = 200
      ctx.body = {
        code: "SUCCESS",
        msg: "修改成功",
      }
    } catch (error) {
      ctx.status = 200
      ctx.body = {
        code: "FAILED",
        msg: "修改失败",
      }
    }
  } else {
    // 新增
    try {
      const isUserExit = await menuModel.findOne({
        where: {
          // @ts-ignore
          code: request.code,
        },
      })

      if (isUserExit) {
        ctx.status = 200
        ctx.body = {
          code: "FAILED",
          msg: "菜单编码已存在",
        }
        return
      }
      await menuModel.create({
        // @ts-ignore
        ...request,
      })
      ctx.status = 200
      ctx.body = {
        code: "SUCCESS",
        msg: "添加成功",
      }
    } catch (error) {
      ctx.status = 200
      ctx.body = {
        code: "FAILED",
        msg: "添加失败",
      }
    }
  }
}

export const deleteMenu = async (ctx: Context) => {
  const request = ctx.request.body

  try {
    await menuModel.destroy({
      where: {
        id: {
          [Op.or]: request,
        },
      },
      force: true,
    })

    ctx.status = 200
    ctx.body = {
      code: "SUCCESS",
      msg: "删除成功",
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: "删除失败",
    }
  }
}
