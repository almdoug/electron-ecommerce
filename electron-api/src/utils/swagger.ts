import { SwaggerOptions } from '@fastify/swagger';

export const swaggerOptions: SwaggerOptions = {
  swagger: {
    info: {
      title: 'Electron API',
      description: 'API para o e-commerce Electron',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Encontre mais informações aqui',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'User', description: 'Operações com usuários' },
      { name: 'Product', description: 'Operações com produtos' },
      { name: 'Order', description: 'Operações com pedidos' },
      { name: 'Auth', description: 'Operações de autenticação' },
    ],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
}; 