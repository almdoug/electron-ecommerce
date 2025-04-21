import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

// Esquema para adicionar item ao carrinho
const addToCartSchema = z.object({
  productId: z.string().uuid({ message: 'ID do produto inválido' }),
  quantity: z.number().int().min(1, { message: 'A quantidade deve ser pelo menos 1' }).default(1)
});

// Esquema para atualizar item do carrinho
const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, { message: 'A quantidade deve ser pelo menos 1' })
});

// Esquema para parâmetros de ID do item
const cartItemIdSchema = z.object({
  itemId: z.string().uuid({ message: 'ID do item inválido' })
});

// Esquema de resposta para item do carrinho
const cartItemResponseSchema = z.object({
  id: z.string(),
  product: z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    discountedPrice: z.number().nullable(),
    images: z.array(z.object({
      url: z.string()
    }))
  }),
  quantity: z.number(),
  price: z.number(),
  subtotal: z.number()
});

// Esquema de resposta para o carrinho completo
const cartResponseSchema = z.object({
  id: z.string(),
  items: z.array(cartItemResponseSchema),
  total: z.number(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date())
});

// Tipos de entrada para as operações
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CartItemIdParam = z.infer<typeof cartItemIdSchema>;

// Tipos para as respostas
export type CartItemResponse = z.infer<typeof cartItemResponseSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>;

// Construir schemas JSON para Fastify
export const { schemas: cartSchemas, $ref } = buildJsonSchemas({
  addToCartSchema,
  updateCartItemSchema,
  cartItemIdSchema,
  cartItemResponseSchema,
  cartResponseSchema
}, { $id: 'cartSchemas' }); 