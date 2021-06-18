import { Context, Next } from 'koa'
import axios from 'axios'
import config from '../config'

export default function (isInterrupted = true) {

  return async function (ctx: Context, next: Next) {
    const accessToken = ctx.cookies.get(config.cookiekey.accessToken)
    // const refreshToken = ctx.cookies.get(config.cookiekey.refreshToken)
    ctx.data = {}

    if (!accessToken && isInterrupted) {
      ctx.status = 401
      return
    }

    try {
      const res = await axios.get('https://sso.xunlei.cn/v1/api/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log('userinfo===>',res.data)
      ctx.data.user = res.data
      return next()
    } catch (error) {
      console.log('userinfo===>', error.response?.status)

      if (isInterrupted) {
        if (error.response && error.response.status) {
          ctx.status = error.response.status
        } else {
          ctx.status = 401
        }
      } else {
        return next()
      }
    }
  }
}