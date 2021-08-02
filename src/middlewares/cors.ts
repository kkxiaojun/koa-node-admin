import { Context } from 'koa'

export const corsHandler = {
  origin: function (ctx: Context) {
    return '*'
  },
  exposeHeaders: ['Authorization'],
  maxAge: 5 * 24 * 60 * 60,
  // credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}
