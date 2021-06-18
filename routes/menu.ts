/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:41:54 
 * @Last Modified by:   zhaoguojun 
 * @Last Modified time: 2021-06-17 17:41:54 
 */

import Router from "koa-router"
const routerInit = new Router({ prefix: "/menu" })

import {
  queryMenu,
  queryMenuList,
  saveOrUpdateMenu,
  deleteMenu,
} from "../controllers/menu"

routerInit.get("/menuAllList", queryMenu)
routerInit.post("/menuList", queryMenuList)
routerInit.post("/saveOrUpdateMenu", saveOrUpdateMenu)
routerInit.post("/deleteByMenu", deleteMenu)

export default routerInit
