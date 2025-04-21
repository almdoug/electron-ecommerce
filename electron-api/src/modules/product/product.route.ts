import { FastifyInstance } from 'fastify';
import {
  createProductHandler,
  getProductHandler,
  getProductsHandler,
  updateProductHandler,
  updateProductStockHandler,
  deleteProductHandler,
  addProductImageHandler,
  deleteProductImageHandler,
  getCategoriesHandler,
  getFeaturedProductsHandler
} from './product.controller';
import { $ref, productSchemas } from './product.schema';

export async function productRoutes(server: FastifyInstance) {
  // Registrar schemas para documentação
  for (const schema of productSchemas) {
    server.addSchema(schema);
  }

  // Rotas públicas (não requerem autenticação)
  
  // Obter produtos com filtros
  server.get(
    '/',
    {
      schema: {
        querystring: $ref('productFilterSchema'),
        response: {
          200: {
            type: 'object',
            properties: {
              products: $ref('productsResponseSchema'),
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
              totalPages: { type: 'number' }
            }
          }
        },
        tags: ['Product'],
        description: 'Listar produtos com filtros opcionais'
      }
    },
    getProductsHandler
  );

  // Obter um produto pelo ID
  server.get(
    '/:id',
    {
      schema: {
        response: {
          200: $ref('productResponseSchema')
        },
        tags: ['Product'],
        description: 'Obter detalhes de um produto específico'
      }
    },
    getProductHandler
  );

  // Obter categorias disponíveis
  server.get(
    '/categories',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        tags: ['Product'],
        description: 'Listar todas as categorias disponíveis'
      }
    },
    getCategoriesHandler
  );

  // Obter produtos em destaque
  server.get(
    '/featured',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            limit: { type: 'number' }
          }
        },
        response: {
          200: $ref('productsResponseSchema')
        },
        tags: ['Product'],
        description: 'Listar produtos em destaque'
      }
    },
    getFeaturedProductsHandler
  );

  // Rotas que requerem autenticação como admin
  
  // Criar um novo produto
  server.post(
    '/',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('createProductSchema'),
        response: {
          201: $ref('productResponseSchema')
        },
        tags: ['Product'],
        description: 'Criar um novo produto (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    createProductHandler
  );

  // Atualizar um produto
  server.put(
    '/:id',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('updateProductSchema'),
        response: {
          200: $ref('productResponseSchema')
        },
        tags: ['Product'],
        description: 'Atualizar um produto existente (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    updateProductHandler
  );

  // Atualizar estoque de um produto
  server.patch(
    '/:id/stock',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('updateStockSchema'),
        response: {
          200: $ref('productResponseSchema')
        },
        tags: ['Product'],
        description: 'Atualizar o estoque de um produto (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    updateProductStockHandler
  );

  // Excluir um produto
  server.delete(
    '/:id',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          204: {
            type: 'null',
            description: 'Produto excluído com sucesso'
          }
        },
        tags: ['Product'],
        description: 'Excluir um produto (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    deleteProductHandler
  );

  // Adicionar imagem a um produto
  server.post(
    '/images',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        body: $ref('uploadImageSchema'),
        response: {
          201: $ref('productImageResponseSchema')
        },
        tags: ['Product'],
        description: 'Adicionar uma imagem a um produto (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    addProductImageHandler
  );

  // Excluir imagem de um produto
  server.delete(
    '/images/:id',
    {
      // @ts-ignore - O authenticate é adicionado como decorator no server.ts
      onRequest: [server.authenticate],
      schema: {
        response: {
          204: {
            type: 'null',
            description: 'Imagem excluída com sucesso'
          }
        },
        tags: ['Product'],
        description: 'Excluir uma imagem de produto (apenas admin)',
        security: [{ bearerAuth: [] }]
      }
    },
    deleteProductImageHandler
  );
} 