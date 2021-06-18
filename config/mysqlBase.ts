type NodeEnv = {
  /**
   *数据库名
   * @type {string}
   */
  mysqlName?: string,
  /**
   *数据库用户名
   * @type {string}
   */
  mysqlUserName?: string,
  /**
   *数据库用户密码
   * @type {string}
   */
  mysqlPassword?: string,
  /**
   *mysql部署的机器IP
   * @type {string}
   */
  mysqlIp?: string,
}

const development: NodeEnv = {
  mysqlName: 'xl_admin',
  mysqlUserName: 'root',
  mysqlPassword: 'xunlei@222',
  mysqlIp: '127.0.0.1',
}

const production: NodeEnv = {
  mysqlName: 'xl_admin',
  mysqlUserName: 'root',
  mysqlPassword: 'xunlei@222',
  mysqlIp: '127.0.0.1',
}

module.exports = {
  development: development,
  production: production,
}[process.env.NODE_ENV || 'development']