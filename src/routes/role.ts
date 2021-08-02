/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:42:01
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-15 20:32:57
 */

import Router from 'koa-router'
import RoleController from '../controllers/role'

const routerInit = new Router({ prefix: '/v1/role' })

/**
 * @swagger
 * definitions:
 *   rolerole:
 *     properties:
 *       appId:
 *         type: integer
 *         title: appId
 *       id:
 *         type: integer
 *         title: 角色Id
 *       menuIds:
 *         type: string
 *         title: 菜单Id数组,[1,2,3]
 *       roleName:
 *         type: string
 *         title: 角色名称
 *       remark:
 *         type: string
 *         title: 备注
 */
/**
 * @swagger
 * definitions:
 *   rolerole1:
 *     properties:
 *       userId:
 *         type: integer
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
 *         title: 菜单Ids
 *       roleName:
 *         type: string
 *         title: 角色名称
 *       role:
 *         type: string
 *         title: 角色标识
 *       remark:
 *         type: string
 *         title: 备注
 */
/**
 * @swagger
 * definitions:
 *   RoleModel:
 *     properties:
 *       name:
 *         type: string
 *         title: 角色名称
 *       pageNo:
 *         type: number
 *       pageSize:
 *         type: number
 */
/**
 * @swagger
 * /v1/role/list/${appId}:
 *   post:
 *     description: 获取角色列表
 *     tags: [角色模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "查询参数"
 *       schema:
 *         $ref: "#/definitions/RoleModel"
 *     responses:
 *       200:
 *         description: 获取角色成功
 *         schema:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *             rows:
 *               type: array
 *               items:
 *                   $ref: '#/definitions/Login'
 *
 */
routerInit.post('/list/:appId', RoleController.getRoleList)
/**
 * @swagger
 * /v1/role/all/list/${appId}:
 *   post:
 *     description: 获取全部角色
 *     tags: [角色模块]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 获取角色成功
 *         schema:
 *           type: array
 *           items:
 *                 $ref: '#/definitions/Login'
 *
 */
routerInit.post('/all/list/:appId', RoleController.getAllRoleList)
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
 *       roleName:
 *         type: string
 *         title: 角色名称
 *       role:
 *         type: string
 *         title: 角色标识
 */
/**
 * @swagger
 * /v1/role/add:
 *   post:
 *     description: 新增或修改角色
 *     tags: [角色模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "新增或更新角色"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/rolerole"
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 *
 */
routerInit.post('/add', RoleController.add)
/**
 * @swagger
 * /v1/role/update:
 *   post:
 *     description: 新增或修改角色
 *     tags: [角色模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "新增或更新角色"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/rolerole"
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 *
 */
routerInit.post('/update', RoleController.update)
/**
 * @swagger
 * /v1/role/delete:
 *   post:
 *     description: 删除角色
 *     tags: [角色模块]
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
routerInit.post('/delete', RoleController.deleteRole)
/**
 * @swagger
 * /v1/role/associate/users:
 *   post:
 *     description: 角色关联用户
 *     tags: [角色模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "params"
 *       name: "appId"
 *       required: true
 *     - in: "params"
 *       name: "roleId"
 *       required: true
 *     - in: "params"
 *       name: "userIds"
 *       description: "userid, userid,userid"
 *       required: true
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 */
routerInit.post('/associate/users', RoleController.associatedUsers)
/**
 * @swagger
 * definitions:
 *   RoleRole:
 *     properties:
 *       id:
 *         type: integer
 */
/**
 * @swagger
 * /v1/role/associated/users:
 *   post:
 *     description: 角色已关联的用户
 *     tags: [角色模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "params"
 *       name: "appId"
 *       required: true
 *     - in: "params"
 *       name: "roleId"
 *       required: true
 *     responses:
 *       200:
 *         description: 获取角色成功
 *         schema:
 *           type: array
 *           items:
 *                 $ref: '#/definitions/rolerole1'
 */
routerInit.post('/associated/users', RoleController.getUsersByRole)
export default routerInit
