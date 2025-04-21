import { FastifyInstance } from 'fastify';
import {
  validateZipCodeHandler,
  calculateShippingHandler,
  createFreeShippingRuleHandler,
  updateFreeShippingRuleHandler,
  deleteFreeShippingRuleHandler,
  getFreeShippingRuleHandler,
  listFreeShippingRulesHandler
} from './shipping.controller';
import { $ref, shippingSchemas } from './shipping.schema';

export async function shippingRoutes(server: FastifyInstance) {
  // Registrar schemas para documentação
  for (const schema of shippingSchemas) {
    server.addSchema(schema);
  }

  // Rotas públicas
  
  // Validar CEP
  server.post(
    '/validate-zipcode',
    {
      schema: {
        body: $ref('zipCodeValidationSchema'),
        response: {
          200: $ref('zipCodeValidationResponseSchema')
        },
        tags: ['Shipping'],
        description: 'Validar um CEP e obter informações de endereço'
      }
    },
    validateZipCodeHandler
  );

  // Rotas autenticadas

  // Calcular opções de frete
  server.post(
    '/calculate',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('calculateShippingSchema'),
        response: {
          200: $ref('shippingCalculationResponseSchema')
        },
        tags: ['Shipping'],
        description: 'Calcular opções de frete disponíveis para um conjunto de itens',
        security: [{ bearerAuth: [] }]
      }
    },
    calculateShippingHandler
  );

  // Rotas para gerenciamento de regras de frete grátis (apenas admin)

  // Listar todas as regras de frete grátis
  server.get(
    '/free-shipping-rules',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: $ref('freeShippingRulesResponseSchema')
        },
        tags: ['Shipping'],
        description: 'Listar todas as regras de frete grátis',
        security: [{ bearerAuth: [] }]
      }
    },
    listFreeShippingRulesHandler
  );

  // Obter regra de frete grátis específica
  server.get(
    '/free-shipping-rules/:ruleId',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          200: $ref('freeShippingRuleResponseSchema')
        },
        tags: ['Shipping'],
        description: 'Obter uma regra de frete grátis pelo ID',
        security: [{ bearerAuth: [] }]
      }
    },
    getFreeShippingRuleHandler
  );

  // Criar nova regra de frete grátis
  server.post(
    '/free-shipping-rules',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('freeShippingRuleSchema'),
        response: {
          201: $ref('freeShippingRuleResponseSchema')
        },
        tags: ['Shipping'],
        description: 'Criar uma nova regra de frete grátis (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    createFreeShippingRuleHandler
  );

  // Atualizar regra de frete grátis
  server.put(
    '/free-shipping-rules/:ruleId',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('freeShippingRuleSchema'),
        response: {
          200: $ref('freeShippingRuleResponseSchema')
        },
        tags: ['Shipping'],
        description: 'Atualizar uma regra de frete grátis existente (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    updateFreeShippingRuleHandler
  );

  // Excluir regra de frete grátis
  server.delete(
    '/free-shipping-rules/:ruleId',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          204: {
            type: 'null',
            description: 'Regra de frete grátis excluída com sucesso'
          }
        },
        tags: ['Shipping'],
        description: 'Excluir uma regra de frete grátis (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    deleteFreeShippingRuleHandler
  );
} 