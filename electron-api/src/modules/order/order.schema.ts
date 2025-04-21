import { z } from 'zod';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { buildJsonSchemas } from 'fastify-zod';

// Esquema para criar um pedido a partir do carrinho
const createOrderSchema = z.object({
  addressId: z.string().uuid({ message: 'ID do endereço inválido' }),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Método de pagamento inválido' })
  }),
  shippingCost: z.number().min(0, { message: 'O custo de envio não pode ser negativo' }).default(0)
});

// Esquema para atualizar o status de um pedido
const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    errorMap: () => ({ message: 'Status do pedido inválido' })
  })
});

// Esquema para parâmetros de ID do pedido
const orderIdParamSchema = z.object({
  orderId: z.string().uuid({ message: 'ID do pedido inválido' })
});

// Esquema para listar pedidos com filtros opcionais
const listOrdersSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('10')
});

// Esquema para item do pedido na resposta
const orderItemResponseSchema = z.object({
  id: z.string(),
  product: z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    images: z.array(z.object({
      url: z.string()
    }))
  }),
  quantity: z.number(),
  price: z.number(),
  subtotal: z.number()
});

// Esquema para resposta de um pedido
const orderResponseSchema = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string()
  }),
  address: z.object({
    id: z.string(),
    street: z.string(),
    number: z.string(),
    complement: z.string().nullable().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string()
  }).nullable(),
  items: z.array(orderItemResponseSchema),
  status: z.nativeEnum(OrderStatus),
  total: z.number(),
  shippingCost: z.number(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentIntentId: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string())
});

// Esquema para resposta da listagem de pedidos
const ordersListResponseSchema = z.object({
  orders: z.array(orderResponseSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
});

// Tipos para o TypeScript
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderIdParam = z.infer<typeof orderIdParamSchema>;
export type ListOrdersQuery = z.infer<typeof listOrdersSchema>;
export type OrderItemResponse = z.infer<typeof orderItemResponseSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type OrdersListResponse = z.infer<typeof ordersListResponseSchema>;

// Construir schemas JSON para Fastify
export const { schemas: orderSchemas, $ref } = buildJsonSchemas({
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
  listOrdersSchema,
  orderItemResponseSchema,
  orderResponseSchema,
  ordersListResponseSchema
}, { $id: 'orderSchemas' }); 