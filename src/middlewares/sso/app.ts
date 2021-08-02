import Koa from 'koa'
import koaRouter from 'koa-router'
import indexRouter from './routes/index'

export default function getApp() {
  const router = new koaRouter()
  const app = new Koa()
  // 路由
  router.use('/api', indexRouter.routes(), indexRouter.allowedMethods())
  app.use(router.routes()).use(router.allowedMethods())

  return app
}
