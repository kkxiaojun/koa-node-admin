/*
 * @Author: zhaoguojun 
 * @Date: 2021-06-17 17:42:01 
 * @Last Modified by:   zhaoguojun 
 * @Last Modified time: 2021-06-17 17:42:01 
 */

import Router from "koa-router"
import { saveOrUpdateRole, queryRole, deleteRole } from "../controllers/role"

const routerInit = new Router({ prefix: "/role" })

routerInit.post("/saveOrUpdateRole", saveOrUpdateRole)


/**
 * @swagger
 * definitions:
 *   Login:
 *     properties:
 *       id:
 *         type: integer
 *       menuId:
 *         type: string
 *       name:
 *         type: string
 *         title: 菜单标题
 */
/**
 * @swagger
 * /empty-item/role/roleList:
 *   post:
 *     description: 获取角色列表
 *     tags: [角色模块]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 获取角色成功
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Login'
 *   
 */
routerInit.post("/roleList", queryRole)
routerInit.post("/deleteById", deleteRole)

export default routerInit
