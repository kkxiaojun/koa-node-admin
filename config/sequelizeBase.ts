/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-16 11:27:47 
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-06-17 17:41:26
 */

/* sequelize基础配置文件 */
const Sequelize = require('sequelize')
const mysqlConfig = require('./mysqlBase')
// 参数依次为：要导入的数据库名，账号，密码
const sequelize = new Sequelize(mysqlConfig.mysqlName, mysqlConfig.mysqlUserName, mysqlConfig.mysqlPassword, {
    host: mysqlConfig.mysqlIp,
    dialect: 'mysql'
});

module.exports = sequelize