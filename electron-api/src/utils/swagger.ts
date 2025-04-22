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
        description: `
Como obter seu token:
          
1. Faça uma requisição POST para /api/users/login com suas credenciais
2. Copie o token retornado no campo "token"
3. Insira o token no formato: Bearer {seu_token}
4. Clique em "Authorize" para salvar

Os tokens JWT expiram após 24 horas e precisam ser renovados.
        `
      },
    },
    definitions: {
      ErrorResponse: {
        type: 'object',
        required: ['message', 'statusCode'],
        properties: {
          statusCode: {
            type: 'integer',
            format: 'int32',
            example: 400,
            description: 'Código HTTP do erro'
          },
          message: {
            type: 'string',
            example: 'Requisição inválida',
            description: 'Mensagem explicativa do erro'
          },
          error: {
            type: 'string',
            example: 'BadRequest',
            description: 'Tipo do erro (opcional)'
          }
        }
      }
    }
  }
}; 