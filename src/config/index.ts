import path from 'path'

module.exports = {
  port: 4000,
  jwtSecret: 'jwtSecret1',
  logPath: path.resolve(__dirname, '../../logs/koa.log'),
  jwtWhileList: [
    /\/v1\/oauth2\/authorize/,
    /\/v1\/oauth2\/token/,
    /\/oauth2\/auth/,
    /\/user\/login/,
    /docs/,
  ],
}
