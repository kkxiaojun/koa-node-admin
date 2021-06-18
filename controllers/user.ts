/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:41:08 
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-06-18 18:14:05
 */

import { Context } from "koa"
const { roleModel, userModel, menuModel } = require("../models/index")
const { decrypt, encrypt } = require("../util")
const Sequelize = require("sequelize")
const sequelize = require("../config/sequelizeBase")
const { Op } = Sequelize

// 登录
export const setLogin = async (ctx: Context) => {
  const request = ctx.request.body
  try {
    const currentUser = await userModel.findOne({
      where: {
        // @ts-ignore
        loginName: request.loginName,
      },
      raw: true,
      include: [
        {
          model: roleModel,
        },
      ],
    })
    // if (ctx.session.captcha !== request.verifyCode) {
    //     throw new Error('验证码不正确');
    // }
    if (!currentUser) {
      throw new Error("用户不存在")
    }
    // @ts-ignore
    if (decrypt(currentUser.password) !== request.password) {
      throw new Error("密码不正确")
    }
    const menus = await sequelize.query(
      `SELECT * from sys_role_menu  a LEFT JOIN sys_menu b ON a.menu_id=b.id where a.role_id=${currentUser.roleId};`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    )
    const menuItem = {
      path: "/",
      routes: formatMenus(menus),
      authority: currentUser["sys_role.role"],
    }
    // 一个页面下的所有子权限
    const pageAuth = menus
      // @ts-ignore
      .filter((item) => item.resource_type === "pageAuth")
      // @ts-ignore
      .map((item) => item.code)
    ctx.status = 200
    ctx.body = {
      code: "SUCCESS",
      data: {
        id: currentUser.id,
        roleCode: currentUser["sys_role.role"],
        loginName: currentUser.loginName,
        realName: currentUser.realName,
        menuItem,
        pageAuth,
      },
      msg: "登录成功",
    }
    ctx.session.isLogin = true
    ctx.session.userId = currentUser.id
    ctx.session.lastLoginDate = currentUser.loginDate
    // 所有需要校验权限的api
    const allAuthApi = await menuModel.findAll({
      attributes: ["apiUrl"],
      raw: true,
      where: {
        resourceType: "pageAuth",
      },
    })
    // @ts-ignore
    ctx.session.allAuthApi = allAuthApi.map((item) => item.apiUrl)
    ctx.session.allowApi = menus
      .map((item: any) => {
        if (item.resource_type === "pageAuth") {
          return item.apiUrl
        }
      })
      .filter((item: any) => item)
    ctx.session.allowPage = menus
      .map((item: any) => {
        if (item.resource_type === "button") {
          return item.router
        }
      })
      .filter((item: any) => item)

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
      code: "FAILED",
      msg: error.message,
    }
  }
}

// 登出
export const setLogout = (ctx: Context) => {
  ctx.session.isLogin = false
  ctx.status = 200
  ctx.body = {
    code: "SUCCESS",
    msg: "退出成功",
  }
}

// 获取当前用户信息
export const queryUser = async (ctx: Context) => {
  try {
    const result = await userModel.findOne({
      attributes: ["id", "realName"],
      where: {
        id: ctx.session.userId,
      },
    })
    result.dataValues.loginDate = ctx.session.lastLoginDate
    ctx.status = 200
    ctx.body = {
      code: "SUCCESS",
      msg: "查询用户详情成功",
      data: result.dataValues,
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: "查询失败",
    }
  }
}

// 获取用户信息
export const queryDetail = async (ctx: Context) => {
  const request = ctx.query
  try {
    const result = await userModel.findOne({
      where: {
        id: request.id,
      },
      raw: true,
      include: [
        {
          model: roleModel,
          attributes: ["name"],
        },
      ],
    })
    if (!result) {
      throw new Error("用户不存在")
    }
    delete result.password
    result.roleName = result["sys_role.name"]
    delete result["sys_role.name"]
    ctx.status = 200
    ctx.body = {
      code: "SUCCESS",
      msg: "查询用户详情成功",
      data: result,
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: error.message,
    }
  }
}

// 获取用户列表
export const queryUserList = async (ctx: Context) => {
  const request = ctx.request.body
  // console.log(request);
  const where = {}
  // @ts-ignore
  const columnKey = request.columnKey || "createdAt"
  let order
  // @ts-ignore
  switch (request.order) {
    case "descend":
      order = "DESC"
      break
    case "ascend":
      order = "ASC"
      break
    default:
      order = "DESC"
      break
  }
  // @ts-ignore
  if (request.loginName) {
    // @ts-ignore
    where.loginName = {
      // @ts-ignore
      [Op.like]: `%${request.loginName}%`,
    }
  }
  // @ts-ignore
  if (request.roleId) {
    // @ts-ignore
    where.roleId = request.roleId
  }
  try {
    const userList = await userModel.findAndCountAll({
      attributes: [
        "id",
        "roleId",
        "loginName",
        "loginDate",
        "realName",
        "phone",
        "email",
        [Sequelize.col("name"), "roleName"],
      ],
      where,
      // @ts-ignore
      offset: request.pageSize * (request.pageNo - 1),
      // @ts-ignore
      limit: request.pageSize,
      order: [[columnKey, order]],
      raw: true,
      include: [
        {
          model: roleModel,
          attributes: [],
        },
      ],
    })
    userList.total = userList.count
    delete userList.count
    ctx.status = 200
    ctx.body = ctx.body = {
      code: "SUCCESS",
      msg: "查询用户列表成功",
      data: userList,
    }
  } catch (error) {
    console.log(error)
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: "查询失败",
    }
  }
}

// 新增或修改用户
export const saveOrUpdateUser = async (ctx: Context) => {
  const request = ctx.request.body
  console.log(request)
  // @ts-ignore
  if (request.id) {
    try {
      await userModel.update(
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
      const isUserExit = await userModel.findOne({
        where: {
          // @ts-ignore
          loginName: request.loginName,
        },
      })

      if (isUserExit) {
        ctx.status = 200
        ctx.body = {
          code: "FAILED",
          msg: "用户已存在",
        }
        return
      }
      // @ts-ignore
      request.password = encrypt(request.password)
      await userModel.create({
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

export const deleteUser = async (ctx: Context) => {
  const request = ctx.request.body
  console.log(request)

  try {
    await userModel.destroy({
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

export const resetPassword = async (ctx: Context) => {
  const request = ctx.query
  console.log(request)

  try {
    await userModel.update(
      {
        password: encrypt("123456"),
      },
      {
        where: {
          id: request.id,
        },
      }
    )

    ctx.status = 200
    ctx.body = {
      code: "SUCCESS",
      msg: "密码重置成功",
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: "密码重置失败",
    }
  }
}

// 修改密码
export const editPassword = async (ctx: Context) => {
  const request = ctx.request.body
  console.log(request)

  try {
    const currentUser = await userModel.findOne({
      where: {
        id: ctx.session.userId,
      },
    })
    // @ts-ignore
    if (request.password !== decrypt(currentUser.password)) {
      throw new Error("旧密码不正确")
    }
    await userModel.update(
      {
        // @ts-ignore
        password: encrypt(request.newPassword),
      },
      {
        where: {
          id: ctx.session.userId,
        },
      }
    )
    ctx.status = 200
    ctx.body = {
      code: "SUCCESS",
      msg: "密码修改成功",
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: error.message,
    }
  }
}

export const autoLogin = async (ctx: Context) => {
  const request = ctx.query
  console.log(request)

  try {
    await userModel.update(
      {
        password: encrypt("123456"),
      },
      {
        where: {
          id: request.id,
        },
      }
    )

    ctx.status = 200
    ctx.body = {
      code: "SUCCESS",
      msg: "密码重置成功",
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: "FAILED",
      msg: "密码重置失败",
    }
  }
}

/**
 * 格式化菜单
 * @param {*} menus
 * @param {number} id
 * @return {*} 
 */
function formatMenus(menus: any, id?: number) {
  const newMenus: Array<any> = [];
  // 查子级
  if (id) {
      menus.forEach((item: any) => {
          if (item.parent_id === id) {
              newMenus.push({
                  hideInMenu: item.is_show === '1' ? false : true,
                  path: item.router,
                  routes: formatMenus(menus, item.id),
                  component: item.component,
                  name: item.name,
              });
          }
      })
  } else {
      menus.forEach((item: any) => {
          if (item.parent_id === 0) {
              newMenus.push({
                  hideInMenu: item.is_show === '1' ? false : true,
                  path: item.router,
                  routes: formatMenus(menus, item.id),
                  component: item.component,
                  name: item.name,

              });
          }
      })
  }
  return newMenus;
}