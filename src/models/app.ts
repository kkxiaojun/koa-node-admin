/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:40:29
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-13 19:58:20
 */

const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')
const appModel = sequelize.define(
  'sys_app',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    appId: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: 'app_id',
    },
    appSecret: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: 'app_secret',
    },
    appName: {
      type: Sequelize.STRING(255),
      allowNull: false,
      field: 'app_name',
    },
    updateTime: {
      type: Sequelize.DATE,
      field: 'update_time',
    },
    remark: {
      type: Sequelize.STRING(255),
    },
  },
  {
    // 启用paranoid 删除
    paranoid: true,
    freezeTableName: true,
  }
)

export default appModel
