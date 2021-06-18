/*
 * @Author: zhaoguojun
 * @Date: 2021-06-15 17:24:49
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-06-18 17:25:03
 */

import Koa from "koa"
import BodyParser from "koa-bodyparser"
import Static from "koa-static"
import KoaMount from "koa-mount"
import Path from "path"
import KoaJwt from 'koa-jwt'
import AddressIP from "ip"
import User from "./routes/user"
import Role from "./routes/role"
import Menu from "./routes/menu"
import Auth from "./routes/auth"
import Swagger from "./routes/swagger"
import SsoApp from "./plugin/sso/app"
import { koaSwagger } from 'koa2-swagger-ui'
// import getUser from "./sso/middlewares/get-user"
const { port, jwtSecret } = require('./config/index')
const source = Static(`${Path.join(__dirname)}/public`)
const app = new Koa()

app.use(BodyParser())

// 迅雷sso模块
app.use(KoaMount('/xl', SsoApp()))

// 获取用户信息
// app.use(getUser(false))

// 静态资源
app.use(source)

// swagger 
app.use(
  koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions: {
      url: '/docs', // example path to json
    },
  })
);


// 错误处理
app.use((ctx, next) => {
  return next().catch((err) => {
    console.log("catch===>", err)
    if(err.status === 401){
        ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    }else{
        throw err;
    }
  })
})

// 注意：放在路由前面
app.use(KoaJwt({
  secret: jwtSecret
}).unless({ // 配置白名单
  path: [/\/oauth2\/authorize/, /login/]
}))

// 路由
app.use(Role.routes()).use(Role.allowedMethods())
app.use(User.routes()).use(User.allowedMethods())
app.use(Menu.routes()).use(Menu.allowedMethods())
app.use(Auth.routes()).use(Auth.allowedMethods())
app.use(Swagger.routes()).use(Swagger.allowedMethods())

app.listen(port, () => {
  console.log(`http://${AddressIP.address()}:${port} 已启动`)
})
