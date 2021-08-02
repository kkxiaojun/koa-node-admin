/*
 * @Author: zhaoguojun
 * @Date: 2021-06-29 20:38:06
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-14 20:41:10
 */

import Router from 'koa-router'
import AppController from '../controllers/app'

const routerInit = new Router({ prefix: '/v1/app' })

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
 *   AppModel:
 *     properties:
 *       appName:
 *         type: string
 *         title: 应用名
 *       appId:
 *         type: string
 *         title: 应用ID
 *       appSecret:
 *         type: string
 *         title: 应用secret
 *       id:
 *         type: number
 *         title: id
 *       remark:
 *         type: string
 *         title: 备注
 */
/**
 * @swagger
 * definitions:
 *   App:
 *     properties:
 *       name:
 *         type: string
 *         required: true
 *         title: 应用名
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
 *       name:
 *         type: string
 *         title: 应用名
 *       appId:
 *         type: string
 *         title: 应用id
 *       appSecret:
 *         type: string
 *         title: secret
 *       remak:
 *         type: string
 *         title: 备注
 */
/**
 * @swagger
 * /v1/app/list:
 *   post:
 *     description: 获取子应用列表
 *     tags: [子应用模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "查询参数"
 *       schema:
 *         $ref: "#/definitions/App"
 *     responses:
 *       200:
 *         description: 获取子应用成功
 *         schema:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *             rows:
 *               type: array
 *               items:
 *                   $ref: '#/definitions/AppModel'
 *
 *
 */
routerInit.post('/list', AppController.getAppList)

/**
 * @swagger
 * /v1/app/add:
 *   post:
 *     description: 新增用户
 *     tags: [子应用模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "params"
 *       name: "appName"
 *       description: "应用名"
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
routerInit.post('/add', AppController.addApp)
/**
 * @swagger
 * /v1/app/update:
 *   post:
 *     description: 更新应用
 *     tags: [子应用模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "params"
 *       name: "id"
 *       description: "应用ID"
 *       required: true
 *     - in: "params"
 *       name: "appName"
 *       description: "应用名"
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
routerInit.post('/update', AppController.updateApp)

/**
 * @swagger
 * /v1/app/delete:
 *   post:
 *     description: 删除应用
 *     tags: [子应用模块]
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: "params"
 *       name: "id"
 *       description: "应用ID"
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 *
 */
routerInit.post('/delete', AppController.deleteApp)

/**
 * @swagger
 * /v1/app/find/${appId}:
 *   post:
 *     description: 应用
 *     tags: [子应用模块]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 成功
 *         schema:
 *             $ref: '#/definitions/Success'
 *
 */
routerInit.post('/find/:appId', AppController.findIdByAppId)

export default routerInit
