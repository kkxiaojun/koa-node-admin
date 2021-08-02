import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import AddressIp from 'ip'
import { PORT } from '../../config/constant'

const swaggerDefinition = {
  info: {
    // API informations (required)
    title: '账号权限系统', // Title (required)
    version: '1.0.0', // Version (required)
    description: '管理接入迅雷sso系统的账号和权限', // Description (optional)
  },
  host: `http://${AddressIp.address()}:${PORT}`, // Host (optional)
  basePath: '/', // Base path (optional)
}

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../../routes/*.ts')], // all api
}

const jsonSpc = swaggerJSDoc(options)
export default jsonSpc
