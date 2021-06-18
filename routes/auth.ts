/*
 * @Author: zhaoguojun
 * @Date: 2021-06-15 19:24:12
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-06-17 16:31:55
 */

import Router from "koa-router"
import { authController } from "../controllers/auth"

const routerInit = new Router({ prefix: "/oauth2" })
routerInit.get("/authorize", authController.authorize)
routerInit.get("/menuList", authController.menulist)

export default routerInit
