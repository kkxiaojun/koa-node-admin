import { Next } from 'koa'
import { koaSwagger } from 'koa2-swagger-ui'

export default function () {
  return async function (next: Next) {
    try {
      koaSwagger({
        routePrefix: '/swagger', // host at /swagger instead of default /docs
        swaggerOptions: {
          url: '/docs', // example path to json
        },
      })
      await next()
    } catch (err) {
      console.log(err)
    }
  }
}
