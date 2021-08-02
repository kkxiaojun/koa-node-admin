/*
 * @Author: zhaoguojun
 * @Date: 2021-06-15 19:24:12
 * @Last Modified by: zhaoguojun
 * @Last Modified time: 2021-07-12 21:21:38
 */

import Router from 'koa-router'
import AuthController from '../controllers/auth'

const routerInit = new Router({ prefix: '/v1/oauth2' })
/**
 * @swagger
 * definitions:
 *   msg:
 *     properties:
 *       code:
 *         type: integer
 *         title: 成功的状态码
 *       message:
 *         type: string
 *         title: 提示语
 */
/**
 * @swagger
 * /v1/oauth2/authorize:
 *   get:
 *     description: 授权并获取token；token设置在url中; url的key为xl_auth_token
 *     tags: [授权模块]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "appId"
 *         in: "query"
 *         description: "sso的clientId"
 *         required: true
 *         type: "string"
 *       - name: "timestamp"
 *         in: "query"
 *         description: "当前时间的时间戳"
 *         required: true
 *         type: "number"
 *       - name: "sign"
 *         in: "query"
 *         description: "appId, timestamp, appSecret转化为 appId=${appId}&timestamp=${timestamp}&appSecret=${appSecret} 进行md5签名的值"
 *         required: true
 *         type: "string"
 *       - name: "redirect_uri"
 *         in: "query"
 *         description: "授权后的回调uri"
 *         required: true
 *         type: "string"
 *     responses:
 *       200:
 *         description: "授权获取token成功"
 *         schema:
 *            $ref: "#/definitions/Success"
 */
routerInit.get('/authorize', AuthController.authorize)
/**
 * @swagger
 * /v1/oauth2/token:
 *   post:
 *     description: 授权后获取token
 *     tags: [授权模块]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: "授权获取token成功"
 *         schema:
 *           type: object
 *           properties:
 *             authToken:
 *               type: string
 *               title: 账号系统token
 *             accessToken:
 *               type: string
 *               title: sso的token
 */
routerInit.post('/token', AuthController.getToken)
// routerInit.get("/menuList", AuthController.menulist)
routerInit.get('/auth', AuthController.auth)

export default routerInit
