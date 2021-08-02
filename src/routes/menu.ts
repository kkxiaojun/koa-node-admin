/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:41:54
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-28 14:32:04
 */

import Router from 'koa-router'
const routerInit = new Router({ prefix: '/v1/menu' })

import MenuController from '../controllers/menu'

/**
 * @swagger
 * definitions:
 *   role:
 *     properties:
 *       id:
 *         type: integer
 *         title: 角色Id
 *       menuIds:
 *         type: string
 *         title: 菜单Id数组,[1,2,3]
 *       name:
 *         type: string
 *         title: 角色名称
 *       role:
 *         type: string
 *         title: 角色标识
 */
/**
 * @swagger
 * definitions:
 *   MenuModel:
 *     properties:
 *       id:
 *         type: integer
 *         title: 角色Id
 *       parentId:
 *         type: integer
 *         title: 父菜单Id
 *       router:
 *         type: string
 *         title: 路由
 *       hideInMenu:
 *         type: integer
 *         title: 是否隐藏
 *       sort:
 *         type: integer
 *         title: 排序
 *       name:
 *         type: string
 *         title: 菜单名
 *       code:
 *         type: string
 *         title: 菜单标识
 *       childData:
 *         type: Object
 */
/**
 * @swagger
 * definitions:
 *   Success:
 *     properties:
 *       code:
 *         type: integer
 *         title: 成功的状态码
 *       msg:
 *         type: string
 *         title: 提示语
 */
/**
 * @swagger
 * definitions:
 *   Login:
 *     properties:
 *       id:
 *         type: integer
 *       menuId:
 *         type: string
 *         title: 菜单Id
 *       name:
 *         type: string
 *         title: 角色名称
 *       role:
 *         type: string
 *         title: 角色标识
 */
/**
 * @swagger
 * definitions:
 *   Menu:
 *     properties:
 *       name:
 *         type: string
 *         title: 菜单名称
 *       pageNo:
 *         type: number
 *       pageSize:
 *         type: number
 */
/**
 * @swagger
 * /v1/menu/list/${appId}:
 *   post:
 *     description: 获取菜单列表
 *     tags: [菜单模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "查询参数"
 *       schema:
 *         $ref: "#/definitions/Menu"
 *     responses:
 *       200:
 *         description: 获取成功
 *         schema:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *             rows:
 *               type: array
 *               items:
 *                   $ref: '#/definitions/MenuModel'
 *
 */
routerInit.post('/list/:appId', MenuController.getMenuList)
/**
 * @swagger
 * /v1/menu/all/list/${appId}:
 *   post:
 *     description: 获取所有菜单列表
 *     tags: [菜单模块]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 获取成功
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/MenuModel'
 *
 */
routerInit.post('/all/list/:appId', MenuController.getMenu)
/**
 * @swagger
 * definitions:
 *   Login:
 *     properties:
 *       id:
 *         type: integer
 *       menuId:
 *         type: string
 *         title: 菜单Id
 *       name:
 *         type: string
 *         title: 角色名称
 *       role:
 *         type: string
 *         title: 角色标识
 */
/**
 * @swagger
 * /v1/menu/add:
 *   post:
 *     description: 新增菜单
 *     tags: [菜单模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "params"
 *       name: "appId"
 *       description: "appId"
 *       required: true
 *     - in: "params"
 *       name: "name"
 *       description: "菜单名"
 *       required: true
 *     - in: "params"
 *       name: "code"
 *       description: "权限编码"
 *       required: true
 *     - in: "params"
 *       name: "router"
 *       description: "菜单url"
 *       required: true
 *     - in: "params"
 *       name: "parentId"
 *       description: "父级菜单"
 *       required: true
 *     - in: "params"
 *       name: "isShow"
 *       description: "是否展示"
 *       required: true
 *     - in: "params"
 *       name: "remark"
 *       description: "备注"
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 *
 */
routerInit.post('/add', MenuController.add)
/**
 * @swagger
 * /v1/menu/update:
 *   post:
 *     description: 更新菜单
 *     tags: [菜单模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "params"
 *       name: "appId"
 *       description: "appId"
 *       required: true
 *     - in: "params"
 *       name: "id"
 *       description: "id"
 *       required: true
 *     - in: "params"
 *       name: "name"
 *       description: "菜单名"
 *       required: true
 *     - in: "params"
 *       name: "router"
 *       description: "菜单url"
 *     - in: "params"
 *       name: "parentId"
 *       description: "父级菜单"
 *       required: true
 *     - in: "params"
 *       name: "resourceType"
 *       description: "类型"
 *       required: true
 *     - in: "params"
 *       name: "isShow"
 *       description: "是否展示"
 *       required: true
 *     - in: "params"
 *       name: "remark"
 *       description: "备注"
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 *
 */
routerInit.post('/update', MenuController.update)
/**
 * @swagger
 * /v1/menu/delete:
 *   post:
 *     description: 删除菜单
 *     tags: [菜单模块]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "id"
 *         in: "query"
 *         description: "id"
 *         type: "number"
 *         required: true
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 *
 */
routerInit.post('/delete', MenuController.delete)
routerInit.post('/import/:appId', MenuController.importJson)
export default routerInit
