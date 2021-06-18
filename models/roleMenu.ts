/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:40:20 
 * @Last Modified by:   zhaoguojun 
 * @Last Modified time: 2021-06-17 17:40:20 
 */

const Sequelize = require("sequelize")
const sequelize = require("../config/sequelizeBase")

const roleMenuModel = sequelize.define(
  "sys_role_menu",
  {
    roleId: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      field: "role_id",
    },
    menuId: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      field: "menu_id",
    },
  },
  {
    // 启用时间戳
    timestamps: false,
    freezeTableName: true,
  }
)

export default roleMenuModel
