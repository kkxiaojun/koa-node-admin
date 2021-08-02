import Router from 'koa-router'
import axios from 'axios'
import FormData from 'form-data'
import config from '../config'
import { Context } from 'koa'

const router = new Router()
// https://sso.xunlei.cn/v1/oauth2/authorize?response_type=code&client_id=65c5187dccbc4c918b7c6dd0d95a2690&redirect_uri=http%3A%2F%2F127.0.0.1%3A4000%2Fxlapi%2Fauth
// https://sso.xunlei.cn/v1/oauth2/authorize?response_type=code&client_id=65c5187dccbc4c918b7c6dd0d95a2690&redirect_uri=http%3A%2F%2F127.0.0.1%3A4000%2Fxlapi%2Fauth%3Fredirect%3Dhttp%253A%252F%252Fbaidu.com

router.get('/ping', (ctx) => {
  ctx.status = 200
  ctx.body = {
    code: 0,
    msg: 'success',
  }
})
/**
 * 单点登录回调接口
 */
router.get('/auth', async (ctx: Context) => {
  const { code: oauthCode, error, redirect } = ctx.query
  if (!oauthCode || error) {
    ctx.status = 401
    return
  }

  // if (!redirect) {
  //   ctx.body = {
  //     ret: 400,
  //     msg: '缺少redirect参数'
  //   }
  //   return
  // }

  try {
    const form = new FormData()
    form.append('grant_type', 'authorization_code')
    form.append('client_id', config.clientID)
    form.append('client_secret', config.clientSecret)
    form.append('redirect_uri', redirect || ctx.request.origin)
    form.append('code', oauthCode)

    const res = await axios.post(
      'https://sso.xunlei.cn/v1/oauth2/token',
      form,
      {
        headers: form.getHeaders(),
      }
    )
    const { access_token, refresh_token, expires_in } = res.data
    const cookieConfig = {
      // httpOnly: true,
      maxAge: expires_in * 1000,
      // secure: false,
      // sameSite: 'none',
      // overwrite: true,
      // path: '/'
    }
    ctx.cookies.set(config.cookiekey.accessToken, access_token, cookieConfig)
    ctx.cookies.set(config.cookiekey.refreshToken, refresh_token, cookieConfig)
    if (redirect) {
      ctx.redirect(String(redirect))
      return
    }
    ctx.body = {
      ret: 0,
      msg: '认证成功',
      data: res.data,
    }
  } catch (error) {
    if (error.response && error.response.status) {
      ctx.status = error.response.status
      return
    }
    console.error(error)
    ctx.body = {
      ret: 500,
      msg: '服务内部错误',
      error: error.message,
    }
    return
  }
})
/**
 * 登出接口
 */
router.post('/logout', async (ctx) => {
  const accessToken = ctx.cookies.get(config.cookiekey.accessToken)
  if (!accessToken) {
    ctx.body = {
      ret: 0,
      msg: '登出成功',
    }
    return
  }

  try {
    await axios.get('https://sso.xunlei.cn/v1/oauth2/logout', {
      params: {
        access_token: accessToken,
      },
    })
    ctx.cookies.set(config.cookiekey.accessToken, '', {
      maxAge: 0,
    })
    ctx.cookies.set(config.cookiekey.refreshToken, '', {
      maxAge: 0,
    })
    ctx.body = {
      ret: 0,
      msg: '登出成功',
    }
  } catch (error) {
    ctx.body = {
      ret: 1,
      msg: '登出失败',
    }
  }
  return
})

/**
 * 获取用户信息,如果没有用户信息直接抛状态异常
 */
router.use(function (ctx: Context, next) {
  if (!ctx.data && !ctx.data.user) {
    ctx.status = 401
    return
  }

  return next()
})
/**
 * 登录接口
 */
router.post('/login', async (ctx: Context) => {
  ctx.body = {
    ret: 0,
    data: ctx.data.user,
  }
  return
})

export default router
