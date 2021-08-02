/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:40:20
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-01 19:44:44
 */

const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')

const roleMenuModel = sequelize.define(
  'sys_app_role',
  {
    appId: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      field: 'app_id',
    },
    roleId: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      field: 'role_id',
    },
  },
  {
    freezeTableName: true,
  }
)

export default roleMenuModel
