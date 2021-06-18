import path from "path"
import swaggerJSDoc from "swagger-jsdoc"
import AddressIp from "ip"
const { port } = require('../../config/index')

const swaggerDefinition = {
  info: {
    // API informations (required)
    title: 'Hello World', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'A sample API', // Description (optional)
  },
  host: `http://${AddressIp.address()}:${port}`, // Host (optional)
  basePath: '/', // Base path (optional)
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname,'../../routes/*.ts')], // all api 
};

const jsonSpc = swaggerJSDoc(options)
export default jsonSpc