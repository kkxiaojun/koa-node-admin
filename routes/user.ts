/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:42:10 
 * @Last Modified by:   zhaoguojun 
 * @Last Modified time: 2021-06-17 17:42:10 
 */

import Router from "koa-router"
import * as user from "../controllers/user"

const routerInit = new Router({ prefix: "/user" })

routerInit.get("/toDetails", user.queryUser)
routerInit.get("/detail", user.queryDetail)
routerInit.post("/login", user.setLogin)
routerInit.get("/loginOut", user.setLogout)
routerInit.post("/list", user.queryUserList)
routerInit.post("/saveOrUpdateUser", user.saveOrUpdateUser)
routerInit.post("/deleteByUser", user.deleteUser)

export default routerInit
