/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:39:55 
 * @Last Modified by:   zhaoguojun 
 * @Last Modified time: 2021-06-17 17:39:55 
 */

const Sequelize = require("sequelize")
const sequelize = require("../config/sequelizeBase")

const roleModel = sequelize.define(
  "sys_role",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(20),
    },
    role: {
      type: Sequelize.STRING(20),
    },
  },
  {
    // 启用时间戳
    timestamps: false,
    freezeTableName: true,
  }
)

export default roleModel
