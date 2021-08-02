/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:40:04
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-01 19:49:16
 */

const Sequelize = require('sequelize')
const sequelize = require('../config/sequelizeBase')

const menuModel = sequelize.define(
  'sys_menu',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    sort: {
      type: Sequelize.BIGINT,
    },
    router: {
      type: Sequelize.STRING(100),
    },
    isShow: {
      type: Sequelize.BIGINT,
      field: 'is_show',
    },
    createDate: {
      type: Sequelize.DATE,
      field: 'create_date',
    },
    appId: {
      type: Sequelize.STRING(255),
      field: 'app_id',
    },
    remark: {
      type: Sequelize.STRING(200),
    },
    resourceType: {
      type: Sequelize.STRING(20),
      field: 'resource_type',
    },
    parentId: {
      type: Sequelize.BIGINT,
      field: 'parent_id',
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: 'deleted_at',
    },
    apiUrl: {
      type: Sequelize.STRING(255),
      field: 'api_url',
    },
  },
  {
    // 启用时间戳
    // timestamps: false,
    // 启用paranoid 删除
    paranoid: true,
    // 停止 Sequelize 执行表名自动复数化.
    freezeTableName: true,
  }
)

export default menuModel
