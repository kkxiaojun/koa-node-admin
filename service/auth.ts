const { roleModel, userModel, menuModel } = require("../models/index")

export default class AuthService {
  public static async isRegister(appId: string) {
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
}
