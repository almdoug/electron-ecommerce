import { FastifyInstance } from 'fastify';
import {
  registerUserHandler,
  loginHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  getCurrentUserHandler
} from './user.controller';
import { $ref, userSchemas } from './user.schema';

export async function userRoutes(server: FastifyInstance) {
  // Registrar schemas para documentação
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  // Rotas públicas
  server.post(
    '/register',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('userResponseSchema'),
        },
        tags: ['Auth'],
        description: 'Registrar um novo usuário',
      },
    },
    registerUserHandler
  );

  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema'),
        },
        tags: ['Auth'],
        description: 'Fazer login e obter token de autenticação',
      },
    },
    loginHandler
  );

  // Rotas privadas - requerem autenticação
  // Prefixo: /api/users

  // Obter usuário atual
  server.get(
    '/me',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: $ref('userResponseSchema'),
        },
        tags: ['User'],
        description: 'Obter perfil do usuário autenticado',
        security: [{ bearerAuth: [] }],
      },
    },
    getCurrentUserHandler
  );

  // Obter usuário por ID
  server.get(
    '/:id',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: $ref('userResponseSchema'),
        },
        tags: ['User'],
        description: 'Obter usuário pelo ID',
        security: [{ bearerAuth: [] }],
      },
    },
    getUserHandler
  );

  // Atualizar usuário
  server.put(
    '/:id',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('updateUserSchema'),
        response: {
          200: $ref('userResponseSchema'),
        },
        tags: ['User'],
        description: 'Atualizar dados do usuário',
        security: [{ bearerAuth: [] }],
      },
    },
    updateUserHandler
  );

  // Excluir usuário
  server.delete(
    '/:id',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        tags: ['User'],
        description: 'Excluir conta de usuário',
        security: [{ bearerAuth: [] }],
      },
    },
    deleteUserHandler
  );

  // Obter todos os usuários (admin)
  server.get(
    '/',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: {
            type: 'array',
            items: $ref('userResponseSchema')
          },
        },
        tags: ['User'],
        description: 'Listar todos os usuários (apenas admin)',
        security: [{ bearerAuth: [] }],
      },
    },
    getAllUsersHandler
  );
} 