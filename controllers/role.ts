/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:40:55 
 * @Last Modified by:   zhaoguojun 
 * @Last Modified time: 2021-06-17 17:40:55 
 */

import { Context } from "koa"
const { roleMenuModel, roleModel } = require("../models/index")
const Sequelize = require("sequelize")
const sequelize = require("../config/sequelizeBase")
const { Op } = Sequelize

// 获取角色列表
// eslint-disable-next-line max-statements
export const queryRole = async (ctx: Context) => {
  try {
    const roleList = await roleModel.findAll({
      attributes: [
        "id",
        "name",
        "role",
        [Sequelize.fn("GROUP_CONCAT", Sequelize.col("menu_id")), "menuId"],
      ],
      include: [
        {
          model: roleMenuModel,
          attributes: [],
        },
      ],
      group: "id",
    })
    ctx.status = 200
    ctx.body = roleList
  } catch (error) {
    console.log(error)
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: "查询失败",
    }
  }
}

// 新增或修改角色
// eslint-disable-next-line max-statements
export const saveOrUpdateRole = async (ctx: Context) => {
  const request = ctx.request.body
  // @ts-ignore
  if (request.id) {
    try {
      // @ts-ignore
      await sequelize.transaction(async (t) => {
        await roleModel.update(
          {
            // @ts-ignore
            name: request.description,
          },
          {
            where: {
              // @ts-ignore
              id: request.id,
            },
            transaction: t,
          }
        )
        await roleMenuModel.destroy({
          where: {
            // @ts-ignore
            roleId: request.id,
          },
          force: true,
          transaction: t,
        })
        // @ts-ignore
        const arr = request.menuIds.map((item) => {
          return {
            // @ts-ignore
            roleId: request.id,
            menuId: item,
          }
        })
        await roleMenuModel.bulkCreate(arr, { transaction: t })
      })
      ctx.status = 200
      ctx.body = {
        code: "SUCCESS",
        msg: "修改成功",
      }
    } catch (error) {
      console.error(error)
      ctx.status = 200
      ctx.body = {
        code: "FAILED",
        msg: "修改失败",
      }
    }
  } else {
    // 新增
    try {
      const isRoleExit = await roleModel.findOne({
        where: {
          // @ts-ignore
          role: request.role,
        },
      })

      if (isRoleExit) {
        ctx.status = 200
        ctx.body = {
          code: "FAILED",
          msg: "权限已存在",
        }
        return
      }
      // @ts-ignore
      await sequelize.transaction(async (t) => {
        const addRoleResult = await roleModel.create(
          {
            // @ts-ignore
            name: request.description,
            // @ts-ignore
            role: request.role,
          },
          { transaction: t }
        )
        // @ts-ignore
        const arr = request.menuIds.map((item) => {
          return {
            roleId: addRoleResult.id,
            menuId: item,
          }
        })
        await roleMenuModel.bulkCreate(arr, { transaction: t })
      })
      ctx.status = 200
      ctx.body = {
        code: "SUCCESS",
        msg: "添加成功",
      }
    } catch (error) {
      console.log(error)
      ctx.status = 200
      ctx.body = {
        code: "FAILED",
        msg: "添加失败",
      }
    }
  }
}

// 删除角色
export const deleteRole = async (ctx: Context) => {
  const request = ctx.request.body
  console.log(request)

  try {
    // @ts-ignore
    await sequelize.transaction(async (t) => {
      await roleModel.destroy({
        where: {
          id: {
            [Op.or]: request,
          },
        },
        force: true,
        transaction: t,
      })
      await roleMenuModel.destroy({
        where: {
          roleId: {
            [Op.or]: request,
          },
        },
        force: true,
        transaction: t,
      })
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
