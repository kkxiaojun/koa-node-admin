/*
 * @Author: zhaoguojun
 * @Date: 2021-06-17 17:42:10
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-15 19:35:41
 */

import Router from 'koa-router'
import UserController from '../controllers/user'

const routerInit = new Router({ prefix: '/v1/user' })

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
 * /v1/user/logout:
 *   get:
 *     description: 登出
 *     tags: [授权模块]
 *     responses:
 *       200:
 *         description: 登出成功
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Success'
 *
 */
routerInit.get('/logout', UserController.logout)
/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *         required: true
 *         title: 用户名
 *       pageNo:
 *         type: number
 *         title: 当前页
 *       pageSize:
 *         type: number
 *         title: 每页数量
 *         default: 10
 */
/**
 * @swagger
 * definitions:
 *   AddUser:
 *     properties:
 *       userName:
 *         type: string
 *         title: 用户名
 *       roleId:
 *         type: number
 *         title: 角色id
 *       email:
 *         type: number
 *         title: 邮箱
 *       phone:
 *         type: number
 *         title: 手机号
 */
/**
 * @swagger
 * definitions:
 *   UserModel:
 *     properties:
 *       appId:
 *         type: string
 *         title: appId
 *       id:
 *         type: number
 *         title: id
 *       userName:
 *         type: string
 *         title: 用户名
 *       name:
 *         type: string
 *         title: 昵称
 *       email:
 *         type: string
 *         title: 邮箱
 *       phone:
 *         type: number
 *         title: 手机号
 *       roleId:
 *         type: number
 *         title: roleId
 *       roleName:
 *         type: string
 *         title: roleName
 */
/**
 * @swagger
 * definitions:
 *   UserModel2:
 *     properties:
 *       id:
 *         type: number
 *         title: id
 *       userName:
 *         type: string
 *         title: 用户名
 *       name:
 *         type: string
 *         title: 昵称
 *       email:
 *         type: string
 *         title: 邮箱
 *       phone:
 *         type: number
 *         title: 手机号
 */
/**
 * @swagger
 * /v1/user/list/${appId}:
 *   post:
 *     description: 获取用户列表
 *     tags: [用户模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "查询参数"
 *       schema:
 *         $ref: "#/definitions/User"
 *     responses:
 *       200:
 *         description: "获取用户成功"
 *         schema:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *             rows:
 *               type: array
 *               items:
 *                   $ref: '#/definitions/UserModel'
 *
 *
 */
routerInit.post('/list/:appId', UserController.getUserList)
/**
 * @swagger
 * /v1/user/all/list:
 *   post:
 *     description: 用户列表
 *     tags: [用户模块]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: "获取用户成功"
 *         schema:
 *               type: array
 *               items:
 *                   $ref: '#/definitions/UserModel2'
 *
 *
 */
routerInit.post('/all/list', UserController.getAllUserList)

/**
 * @swagger
 * /v1/user/userinfo/${appId}:
 *   post:
 *     description: 用户基本信息
 *     tags: [授权模块]
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               title: id
 *             userName:
 *               type: string
 *               title: 用户名
 *             name:
 *               type: string
 *               title: 昵称
 *             email:
 *               type: string
 *               title: 邮箱
 *             phone:
 *               type: number
 *               title: 手机号
 *             accessToken:
 *               type: string
 *               title: sso的token
 *             authToken:
 *               type: string
 *               title: 账号系统的token
 *             menus:
 *               type: array
 *               items:
 *                   $ref: '#/definitions/UserModel1'
 *
 */
routerInit.post('/userinfo/:appId', UserController.getUserBase)

/**
 * @swagger
 * definitions:
 *   UserModel1:
 *     properties:
 *       hideInMenu:
 *         type: boolean
 *         title: 是否隐藏
 *       path:
 *         type: string
 *         title: 路由
 *       routes:
 *         type: object
 *       name:
 *         type: string
 *         title: 名称
 */
/**
 * @swagger
 * /v1/user/add:
 *   post:
 *     description: 新增用户
 *     tags: [用户模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "params"
 *       name: "appId"
 *       required: true
 *     - in: "params"
 *       name: "userName"
 *       description: "用户名（英文）"
 *       required: true
 *     - in: "params"
 *       name: "name"
 *       description: "昵称"
 *       required: true
 *     - in: "params"
 *       name: "roleId"
 *       description: "角色ID"
 *       required: true
 *     - in: "params"
 *       name: "email"
 *       description: "邮箱"
 *     - in: "params"
 *       name: "phone"
 *       description: "手机号"
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 *
 */
routerInit.post('/add', UserController.addUser)
/**
 * @swagger
 * /v1/user/update:
 *   post:
 *     description: 更新用户
 *     tags: [用户模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "params"
 *       name: "appId"
 *       required: true
 *     - in: "params"
 *       name: "id"
 *       description: "用户ID"
 *       required: true
 *     - in: "params"
 *       name: "userName"
 *       required: true
 *       description: "用户名（英文）"
 *     - in: "params"
 *       name: "name"
 *       description: "昵称"
 *       required: true
 *     - in: "params"
 *       name: "roleId"
 *       description: "角色ID"
 *       required: true
 *     - in: "params"
 *       name: "email"
 *       description: "邮箱"
 *     - in: "params"
 *       name: "phone"
 *       description: "手机号"
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 *
 */
routerInit.post('/update', UserController.updateUser)
/**
 * @swagger
 * /v1/user/delete:
 *   post:
 *     description: 删除用户
 *     tags: [用户模块]
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
routerInit.post('/delete', UserController.deleteUser)
export default routerInit
