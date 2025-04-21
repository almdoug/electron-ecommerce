import { FastifyInstance } from 'fastify';
import {
  getCartHandler,
  addToCartHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler
} from './cart.controller';
import { addToCartSchema, updateCartItemSchema, removeCartItemSchema } from './cart.schema';

export async function cartRoutes(app: FastifyInstance) {
  // Middleware de autenticação para todas as rotas do carrinho
  app.addHook('onRequest', app.authenticate);

  // Obter o carrinho do usuário
  app.get(
    '/',
    {
      schema: {
        tags: ['Carrinho'],
        description: 'Obtém o carrinho do usuário autenticado',
        response: {
          200: {
            description: 'Carrinho encontrado com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    product: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        discountedPrice: { type: ['number', 'null'] },
                        images: { 
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              url: { type: 'string' }
                            }
                          }
                        }
                      }
                    },
                    quantity: { type: 'number' },
                    price: { type: 'number' },
                    subtotal: { type: 'number' }
                  }
                }
              },
              total: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          401: {
            description: 'Não autorizado',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    },
    getCartHandler
  );

  // Adicionar item ao carrinho
  app.post(
    '/items',
    {
      schema: {
        tags: ['Carrinho'],
        description: 'Adiciona um item ao carrinho',
        body: {
          type: 'object',
          required: ['productId'],
          properties: {
            productId: { type: 'string', format: 'uuid' },
            quantity: { type: 'integer', minimum: 1, default: 1 }
          }
        },
        response: {
          200: {
            description: 'Item adicionado com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    product: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        discountedPrice: { type: ['number', 'null'] },
                        images: { 
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              url: { type: 'string' }
                            }
                          }
                        }
                      }
                    },
                    quantity: { type: 'number' },
                    price: { type: 'number' },
                    subtotal: { type: 'number' }
                  }
                }
              },
              total: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          400: {
            description: 'Requisição inválida',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          401: {
            description: 'Não autorizado',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    },
    addToCartHandler
  );

  // Atualizar quantidade de um item do carrinho
  app.put(
    '/items/:itemId',
    {
      schema: {
        tags: ['Carrinho'],
        description: 'Atualiza a quantidade de um item no carrinho',
        params: {
          type: 'object',
          required: ['itemId'],
          properties: {
            itemId: { type: 'string', format: 'uuid' }
          }
        },
        body: {
          type: 'object',
          required: ['quantity'],
          properties: {
            quantity: { type: 'integer', minimum: 1 }
          }
        },
        response: {
          200: {
            description: 'Item atualizado com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    product: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        discountedPrice: { type: ['number', 'null'] },
                        images: { 
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              url: { type: 'string' }
                            }
                          }
                        }
                      }
                    },
                    quantity: { type: 'number' },
                    price: { type: 'number' },
                    subtotal: { type: 'number' }
                  }
                }
              },
              total: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          400: {
            description: 'Requisição inválida',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          401: {
            description: 'Não autorizado',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          404: {
            description: 'Item não encontrado',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    },
    updateCartItemHandler
  );

  // Remover item do carrinho
  app.delete(
    '/items/:itemId',
    {
      schema: {
        tags: ['Carrinho'],
        description: 'Remove um item do carrinho',
        params: {
          type: 'object',
          required: ['itemId'],
          properties: {
            itemId: { type: 'string', format: 'uuid' }
          }
        },
        response: {
          200: {
            description: 'Item removido com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    product: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        discountedPrice: { type: ['number', 'null'] },
                        images: { 
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              url: { type: 'string' }
                            }
                          }
                        }
                      }
                    },
                    quantity: { type: 'number' },
                    price: { type: 'number' },
                    subtotal: { type: 'number' }
                  }
                }
              },
              total: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          401: {
            description: 'Não autorizado',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          404: {
            description: 'Item não encontrado',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    },
    removeCartItemHandler
  );

  // Limpar o carrinho
  app.delete(
    '/',
    {
      schema: {
        tags: ['Carrinho'],
        description: 'Limpa o carrinho do usuário',
        response: {
          200: {
            description: 'Carrinho limpo com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    product: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'number' },
                        discountedPrice: { type: ['number', 'null'] },
                        images: { 
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              url: { type: 'string' }
                            }
                          }
                        }
                      }
                    },
                    quantity: { type: 'number' },
                    price: { type: 'number' },
                    subtotal: { type: 'number' }
                  }
                }
              },
              total: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          401: {
            description: 'Não autorizado',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    },
    clearCartHandler
  );
} 