import { FastifyInstance } from 'fastify';
import {
  getCartHandler,
  addToCartHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler
} from './cart.controller';
import { $ref, cartSchemas } from './cart.schema';

export async function cartRoutes(app: FastifyInstance) {
  // Registrar schemas para documentação
  for (const schema of cartSchemas) {
    app.addSchema(schema);
  }

  // Middleware de autenticação para todas as rotas do carrinho
  app.addHook('onRequest', app.authenticate);

  // Obter o carrinho do usuário
  app.get(
    '/',
    {
      schema: {
        response: {
          200: $ref('cartResponseSchema')
        },
        tags: ['Cart'],
        description: 'Obtém o carrinho do usuário autenticado',
        security: [{ bearerAuth: [] }]
      }
    },
    getCartHandler
  );

  // Adicionar item ao carrinho
  app.post(
    '/items',
    {
      schema: {
        body: $ref('addToCartSchema'),
        response: {
          200: $ref('cartResponseSchema')
        },
        tags: ['Cart'],
        description: 'Adiciona um item ao carrinho',
        security: [{ bearerAuth: [] }]
      }
    },
    addToCartHandler
  );

  // Atualizar quantidade de um item do carrinho
  app.put(
    '/items/:itemId',
    {
      schema: {
        params: $ref('cartItemIdSchema'),
        body: $ref('updateCartItemSchema'),
        response: {
          200: $ref('cartResponseSchema')
        },
        tags: ['Cart'],
        description: 'Atualiza a quantidade de um item no carrinho',
        security: [{ bearerAuth: [] }]
      }
    },
    updateCartItemHandler
  );

  // Remover item do carrinho
  app.delete(
    '/items/:itemId',
    {
      schema: {
        params: $ref('cartItemIdSchema'),
        response: {
          200: $ref('cartResponseSchema')
        },
        tags: ['Cart'],
        description: 'Remove um item do carrinho',
        security: [{ bearerAuth: [] }]
      }
    },
    removeCartItemHandler
  );

  // Limpar carrinho
  app.delete(
    '/',
    {
      schema: {
        response: {
          204: {
            type: 'null',
            description: 'Carrinho esvaziado com sucesso'
          }
        },
        tags: ['Cart'],
        description: 'Remove todos os itens do carrinho',
        security: [{ bearerAuth: [] }]
      }
    },
    clearCartHandler
  );
} 