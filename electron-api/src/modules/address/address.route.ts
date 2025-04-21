import { FastifyInstance } from 'fastify';
import {
  createAddressHandler,
  getUserAddressesHandler,
  getAddressByIdHandler,
  updateAddressHandler,
  deleteAddressHandler,
  setDefaultAddressHandler
} from './address.controller';
import { $ref, addressSchemas } from './address.schema';

export async function addressRoutes(server: FastifyInstance) {
  // Registrar schemas para documentação
  for (const schema of addressSchemas) {
    server.addSchema(schema);
  }

  // Todas as rotas requerem autenticação
  // @ts-ignore - O authenticate é adicionado como decorator no server.ts
  server.addHook('onRequest', server.authenticate);

  // Criar endereço
  server.post(
    '/',
    {
      schema: {
        body: $ref('createAddressSchema'),
        response: {
          201: $ref('addressResponseSchema')
        },
        tags: ['Address'],
        description: 'Adicionar um novo endereço para o usuário autenticado',
        security: [{ bearerAuth: [] }]
      }
    },
    createAddressHandler
  );

  // Obter todos os endereços do usuário
  server.get(
    '/',
    {
      schema: {
        response: {
          200: $ref('addressesResponseSchema')
        },
        tags: ['Address'],
        description: 'Listar todos os endereços do usuário autenticado',
        security: [{ bearerAuth: [] }]
      }
    },
    getUserAddressesHandler
  );

  // Obter endereço por ID
  server.get(
    '/:id',
    {
      schema: {
        response: {
          200: $ref('addressResponseSchema')
        },
        tags: ['Address'],
        description: 'Obter um endereço específico pelo ID',
        security: [{ bearerAuth: [] }]
      }
    },
    getAddressByIdHandler
  );

  // Atualizar endereço
  server.put(
    '/:id',
    {
      schema: {
        body: $ref('updateAddressSchema'),
        response: {
          200: $ref('addressResponseSchema')
        },
        tags: ['Address'],
        description: 'Atualizar um endereço existente',
        security: [{ bearerAuth: [] }]
      }
    },
    updateAddressHandler
  );

  // Excluir endereço
  server.delete(
    '/:id',
    {
      schema: {
        response: {
          204: {
            type: 'null',
            description: 'Endereço excluído com sucesso'
          }
        },
        tags: ['Address'],
        description: 'Excluir um endereço',
        security: [{ bearerAuth: [] }]
      }
    },
    deleteAddressHandler
  );

  // Definir endereço como padrão
  server.patch(
    '/:id/default',
    {
      schema: {
        response: {
          200: $ref('addressResponseSchema')
        },
        tags: ['Address'],
        description: 'Definir um endereço como padrão',
        security: [{ bearerAuth: [] }]
      }
    },
    setDefaultAddressHandler
  );
} 