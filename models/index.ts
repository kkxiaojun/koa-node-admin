/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:40:10 
 * @Last Modified by:   zhaoguojun 
 * @Last Modified time: 2021-06-17 17:40:10 
 */

import roleMenuModel from "./roleMenu"
import userModel from "./user"
import menuModel from "./menu"
import roleModel from "./role"
roleModel.hasMany(roleMenuModel, { foreignKey: "roleId" })
roleMenuModel.hasOne(menuModel, { foreignKey: "id" })
userModel.belongsTo(roleModel, {
  foreignKey: "roleId",
  targetKey: "id",
})

module.exports = {
  roleMenuModel,
  userModel,
  menuModel,
  roleModel,
}
