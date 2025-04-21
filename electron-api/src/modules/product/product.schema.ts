import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

// Schema para criar uma imagem de produto
const productImageSchema = z.object({
  url: z.string().url({ message: 'URL da imagem inválida' }),
});

// Schema para criar um produto
const createProductSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  price: z.number().min(0.01, { message: 'Preço deve ser maior que zero' }),
  discountedPrice: z.number().min(0.01, { message: 'Preço com desconto deve ser maior que zero' }).optional(),
  stock: z.number().int({ message: 'Estoque deve ser um número inteiro' }).min(0, { message: 'Estoque não pode ser negativo' }),
  category: z.string().min(2, { message: 'Categoria deve ter pelo menos 2 caracteres' }),
  featured: z.boolean().default(false),
  images: z.array(productImageSchema).min(1, { message: 'Produto deve ter pelo menos uma imagem' }).optional(),
});

// Schema para atualização de produto
const updateProductSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }).optional(),
  description: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }).optional(),
  price: z.number().min(0.01, { message: 'Preço deve ser maior que zero' }).optional(),
  discountedPrice: z.number().min(0.01, { message: 'Preço com desconto deve ser maior que zero' }).nullable().optional(),
  stock: z.number().int({ message: 'Estoque deve ser um número inteiro' }).min(0, { message: 'Estoque não pode ser negativo' }).optional(),
  category: z.string().min(2, { message: 'Categoria deve ter pelo menos 2 caracteres' }).optional(),
  featured: z.boolean().optional(),
});

// Schema para atualização de estoque
const updateStockSchema = z.object({
  stock: z.number().int({ message: 'Estoque deve ser um número inteiro' }).min(0, { message: 'Estoque não pode ser negativo' }),
});

// Schema para resposta da imagem do produto
const productImageResponseSchema = z.object({
  id: z.string(),
  url: z.string(),
  productId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema para resposta do produto
const productResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountedPrice: z.number().nullable(),
  stock: z.number(),
  category: z.string(),
  rating: z.number(),
  featured: z.boolean(),
  images: z.array(productImageResponseSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema para lista de produtos
const productsResponseSchema = z.array(productResponseSchema);

// Schema para filtro de produtos
const productFilterSchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  featured: z.boolean().optional(),
  inStock: z.boolean().optional(),
  page: z.number().int().min(1, { message: 'Página deve ser maior ou igual a 1' }).default(1),
  limit: z.number().int().min(1, { message: 'Limite deve ser maior ou igual a 1' }).default(10),
  sortBy: z.enum(['price', 'title', 'createdAt', 'rating']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Schema para upload de imagem
const uploadImageSchema = z.object({
  productId: z.string(),
  url: z.string().url({ message: 'URL da imagem inválida' }),
});

// Exportando os tipos para uso no TypeScript
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
export type UploadImageInput = z.infer<typeof uploadImageSchema>;
export type ProductImageResponse = z.infer<typeof productImageResponseSchema>;

// Construindo os schemas JSON para o Fastify
export const { schemas: productSchemas, $ref } = buildJsonSchemas({
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
  productResponseSchema,
  productsResponseSchema,
  productFilterSchema,
  uploadImageSchema,
  productImageResponseSchema
}, { $id: 'productSchemas' }); 