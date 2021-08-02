/*
 * @Author: zhaoguojun
 * @Date: 2021-06-15 17:24:49
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-28 10:55:30
 */
import Koa from 'koa'
import BodyParser from 'koa-bodyparser'
import Static from 'koa-static'
import Cors from 'koa2-cors'
import Path from 'path'
import KoaJwt from 'koa-jwt'
import KoaBody from 'koa-body'
import AddressIP from 'ip'
import User from './routes/user'
import Role from './routes/role'
import Menu from './routes/menu'
import Auth from './routes/auth'
import AppObj from './routes/app'
import Swagger from './routes/swagger'
import { koaSwagger } from 'koa2-swagger-ui'
import { loggerMiddleware } from './middlewares/logger'
import { errorHandler, responseHandler } from './middlewares/response'
import { corsHandler } from './middlewares/cors'
import sessionStore from './utils/session'
const Session = require('koa-session')
const source = Static(`${Path.join(__dirname)}/public`)
import { PORT, JwtSecret, JwtWhileList } from './config/constant'

const app = new Koa()

const CONFIG = {
  key: 'sessionId',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: false,
  store: sessionStore,
}

app.use(Session(CONFIG, app))

// Logger
app.use(loggerMiddleware)

// Error Handler
app.use(errorHandler)

app.use(
  KoaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: Path.join(__dirname, '../public/uploads'),
      // 保留文件扩展名
      keepExtensions: true,
    },
  })
)

// ctx.body
app.use(BodyParser())

app.use(Cors(corsHandler))

// 静态资源
app.use(source)

// swagger
app.use(
  koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
      url: '/docs',
    },
  })
)

// 注意：放在路由前面
app.use(
  KoaJwt({ secret: JwtSecret }).unless({
    // 配置白名单
    path: JwtWhileList,
  })
)

// 路由
app.use(Role.routes()).use(Role.allowedMethods())
app.use(User.routes()).use(User.allowedMethods())
app.use(Menu.routes()).use(Menu.allowedMethods())
app.use(Auth.routes()).use(Auth.allowedMethods())
app.use(Swagger.routes()).use(Swagger.allowedMethods())
app.use(AppObj.routes()).use(AppObj.allowedMethods())

// Error Handler
app.use(responseHandler)

app.listen(PORT, () => {
  console.log(`http://${AddressIP.address()}:${PORT} 已启动`)
})

module.exports = app
