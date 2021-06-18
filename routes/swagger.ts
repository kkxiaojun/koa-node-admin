/*
 * @Author: zhaoguojun
 * @Date: 2021-06-15 19:24:12
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-06-17 17:11:57
 */

import Router from "koa-router"
import { Context } from "koa"
import swaggerJSDoc from "../plugin/swagger/swagger.conf"
const routerInit = new Router()

routerInit.get("/docs", (ctx: Context) => {
  ctx.body = swaggerJSDoc
})
export default routerInit
