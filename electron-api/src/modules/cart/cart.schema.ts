import { z } from 'zod';

// Esquema para adicionar item ao carrinho
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid({ message: 'ID do produto inválido' }),
    quantity: z.number().int().positive().default(1)
  })
});

// Esquema para atualizar item do carrinho
export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid({ message: 'ID do item inválido' })
  }),
  body: z.object({
    quantity: z.number().int().positive({ message: 'A quantidade deve ser um número positivo' })
  })
});

// Esquema para remover item do carrinho
export const removeCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid({ message: 'ID do item inválido' })
  })
});

// Tipo para resposta de item do carrinho
export type CartItemResponse = {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    discountedPrice: number | null;
    images: { url: string }[];
  };
  quantity: number;
  price: number;
  subtotal: number;
};

// Tipo para resposta do carrinho completo
export type CartResponse = {
  id: string;
  items: CartItemResponse[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AddToCartInput = z.infer<typeof addToCartSchema>['body'];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>['body'];
export type CartItemIdParam = z.infer<typeof removeCartItemSchema>['params']; 