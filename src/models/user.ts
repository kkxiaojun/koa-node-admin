/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:40:29
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-13 20:18:16
 */

const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')
const userModel = sequelize.define(
  'sys_user',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(50),
      field: 'name',
    },
    userName: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      field: 'user_name',
    },
    email: {
      type: Sequelize.STRING(100),
    },
    phone: {
      type: Sequelize.STRING(200),
    },
    avatar: {
      type: Sequelize.STRING(200),
    },
    loginIp: {
      type: Sequelize.STRING(200),
      field: 'login_ip',
    },
    loginDate: {
      type: Sequelize.DATE,
      field: 'login_date',
    },
    status: {
      type: Sequelize.STRING(200),
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    remark: {
      type: Sequelize.STRING(200),
    },
  },
  {
    // 启用时间戳
    // timestamps: true,
    // 启用paranoid 删除
    paranoid: true,
    freezeTableName: true,
  }
)

export default userModel
