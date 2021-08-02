/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:39:55
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-13 19:36:44
 */

const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')

const roleModel = sequelize.define(
  'sys_role',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    roleName: {
      type: Sequelize.STRING(20),
      field: 'role_name',
    },
    role: {
      type: Sequelize.STRING(20),
    },
    appId: {
      type: Sequelize.BIGINT,
      field: 'app_id',
    },
    isSuper: {
      type: Sequelize.BIGINT,
      field: 'is_super',
    },
    remark: {
      type: Sequelize.STRING(200),
    },
  },
  {
    // 启用时间戳
    // timestamps: false,
    freezeTableName: true,
  }
)

export default roleModel
