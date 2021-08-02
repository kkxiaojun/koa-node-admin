/*
 * @Author: zhaoguojun
 * @Date: 2021-06-15 19:24:12
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-06-24 17:40:16
 */

import Router from 'koa-router'
import { Context } from 'koa'
import swaggerJSDoc from '../middlewares/swagger/swagger.conf'
const routerInit = new Router()

routerInit.get('/docs', (ctx: Context) => {
  ctx.body = swaggerJSDoc
})
export default routerInit
