import { FastifyInstance } from 'fastify';
import {
  createPaymentHandler,
  processPaymentHandler,
  stripeWebhookHandler,
  confirmPaymentHandler,
  cancelPaymentHandler,
  getPaymentHandler,
  getPaymentByOrderHandler
} from './payment.controller';
import { $ref, paymentSchemas } from './payment.schema';

export async function paymentRoutes(server: FastifyInstance) {
  // Registrar schemas para documentação
  for (const schema of paymentSchemas) {
    server.addSchema(schema);
  }

  // Webhook do Stripe (rota pública)
  server.post(
    '/webhook',
    {
      schema: {
        body: $ref('webhookEventSchema'),
        response: {
          200: {
            type: 'object',
            properties: {
              received: { type: 'boolean' }
            }
          }
        },
        tags: ['Payment'],
        description: 'Webhook para receber notificações do Stripe',
      },
    },
    stripeWebhookHandler
  );

  // Rotas privadas - requerem autenticação
  // Prefixo: /api/payments

  // Criar um pagamento
  server.post(
    '/',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('createPaymentSchema'),
        response: {
          201: $ref('paymentResponseSchema'),
        },
        tags: ['Payment'],
        description: 'Criar um registro de pagamento',
        security: [{ bearerAuth: [] }],
      },
    },
    createPaymentHandler
  );

  // Processar um pagamento
  server.post(
    '/process',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('processPaymentSchema'),
        response: {
          200: $ref('stripeIntentResponseSchema'),
        },
        tags: ['Payment'],
        description: 'Processar um pagamento via Stripe',
        security: [{ bearerAuth: [] }],
      },
    },
    processPaymentHandler
  );

  // Confirmar um pagamento (apenas para admin)
  server.post(
    '/:id/confirm',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: $ref('paymentResponseSchema'),
        },
        tags: ['Payment'],
        description: 'Confirmar um pagamento manualmente (admin)',
        security: [{ bearerAuth: [] }],
      },
    },
    confirmPaymentHandler
  );

  // Cancelar um pagamento
  server.post(
    '/:id/cancel',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: $ref('paymentResponseSchema'),
        },
        tags: ['Payment'],
        description: 'Cancelar um pagamento',
        security: [{ bearerAuth: [] }],
      },
    },
    cancelPaymentHandler
  );

  // Buscar um pagamento pelo ID
  server.get(
    '/:id',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: $ref('paymentResponseSchema'),
        },
        tags: ['Payment'],
        description: 'Obter detalhes de um pagamento',
        security: [{ bearerAuth: [] }],
      },
    },
    getPaymentHandler
  );

  // Buscar um pagamento pelo ID do pedido
  server.get(
    '/order/:orderId',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: $ref('paymentResponseSchema'),
        },
        tags: ['Payment'],
        description: 'Obter pagamento pelo ID do pedido',
        security: [{ bearerAuth: [] }],
      },
    },
    getPaymentByOrderHandler
  );
} 