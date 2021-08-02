/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:40:10
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-05 16:43:43
 */

import roleMenuModel from './roleMenu'
import userModel from './user'
import menuModel from './menu'
import roleModel from './role'
import appModel from './app'
import appRoleModel from './appRole'
import userRoleModel from './userRole'
roleModel.hasMany(roleMenuModel, { foreignKey: 'roleId' })
roleMenuModel.hasOne(menuModel, { foreignKey: 'id' })

appModel.hasMany(appRoleModel, { foreignKey: 'appId' })
appRoleModel.hasOne(appModel, { foreignKey: 'id' })

userModel.belongsToMany(roleModel, {
  through: userRoleModel,
  foreignKey: 'userId',
})
roleModel.belongsToMany(userModel, {
  through: userRoleModel,
  foreignKey: 'roleId',
})

roleModel.belongsTo(appModel, {
  foreignKey: 'appId',
  targetKey: 'appId',
})
menuModel.belongsTo(appModel, {
  foreignKey: 'appId',
  targetKey: 'appId',
})
module.exports = {
  roleMenuModel,
  userModel,
  menuModel,
  roleModel,
  appModel,
  userRoleModel,
  appRoleModel,
}
