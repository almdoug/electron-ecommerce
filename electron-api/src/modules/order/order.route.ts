import { FastifyInstance } from 'fastify';
import {
  createOrderHandler,
  getOrderHandler,
  listOrdersHandler,
  updateOrderStatusHandler
} from './order.controller';
import { $ref, orderSchemas } from './order.schema';

export async function orderRoutes(server: FastifyInstance) {
  // Registrar schemas para documentação
  for (const schema of orderSchemas) {
    server.addSchema(schema);
  }

  // Todas as rotas requerem autenticação
  server.addHook('onRequest', server.authenticate);

  // Criar pedido
  server.post(
    '/',
    {
      schema: {
        body: $ref('createOrderSchema'),
        response: {
          201: $ref('orderResponseSchema')
        },
        tags: ['Order'],
        description: 'Criar um novo pedido a partir do carrinho do usuário',
        security: [{ bearerAuth: [] }]
      }
    },
    createOrderHandler
  );

  // Obter pedido por ID
  server.get(
    '/:orderId',
    {
      schema: {
        params: $ref('orderIdParamSchema'),
        response: {
          200: $ref('orderResponseSchema')
        },
        tags: ['Order'],
        description: 'Obter detalhes de um pedido específico',
        security: [{ bearerAuth: [] }]
      }
    },
    getOrderHandler
  );

  // Listar pedidos do usuário
  server.get(
    '/',
    {
      schema: {
        querystring: $ref('listOrdersSchema'),
        response: {
          200: $ref('ordersListResponseSchema')
        },
        tags: ['Order'],
        description: 'Listar pedidos do usuário com filtros opcionais',
        security: [{ bearerAuth: [] }]
      }
    },
    listOrdersHandler
  );

  // Atualizar status do pedido (Admin)
  server.patch(
    '/:orderId/status',
    {
      schema: {
        params: $ref('orderIdParamSchema'),
        body: $ref('updateOrderStatusSchema'),
        response: {
          200: $ref('orderResponseSchema')
        },
        tags: ['Order'],
        description: 'Atualizar o status de um pedido (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    updateOrderStatusHandler
  );
} 