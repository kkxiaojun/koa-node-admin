/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:40:20
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-02 17:56:01
 */

const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')

const userRoleModel = sequelize.define(
  'sys_user_role',
  {
    userId: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      field: 'user_id',
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

export default userRoleModel
