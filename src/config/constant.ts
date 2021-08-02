import path from 'path'

export const ssoAuthorizeUrl =
  'https://sso.xunlei.cn/v1/oauth2/authorize?response_type=code&access_type=offline&include_granted_scopes=true&client_id=65c5187dccbc4c918b7c6dd0d95a2690'

export const ssoTokenUrl = 'https://sso.xunlei.cn/v1/oauth2/token'

export const ssoUserInfoUrl = 'https://sso.xunlei.cn/v1/api/userinfo'

export const PORT = 6200

export const JwtSecret = 'jwtSecret1'

export const LogPath = path.resolve(__dirname, '../../logs/koa.log')

export const JwtWhileList = [
  /\/v1\/oauth2\/authorize/,
  /\/v1\/oauth2\/token/,
  /\/oauth2\/auth/,
  /\/user\/login/,
  /docs/,
]
