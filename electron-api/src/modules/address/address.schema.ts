import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

// Schema para criar um endereço
const createAddressSchema = z.object({
  street: z.string().min(3, { message: 'Rua deve ter pelo menos 3 caracteres' }),
  number: z.string().min(1, { message: 'Número é obrigatório' }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: 'Bairro deve ter pelo menos 2 caracteres' }),
  city: z.string().min(2, { message: 'Cidade deve ter pelo menos 2 caracteres' }),
  state: z.string().min(2, { message: 'Estado deve ter pelo menos 2 caracteres' }),
  zipCode: z.string().min(5, { message: 'CEP deve ter pelo menos 5 caracteres' }),
  isDefault: z.boolean().default(false),
});

// Schema para atualização de endereço
const updateAddressSchema = z.object({
  street: z.string().min(3, { message: 'Rua deve ter pelo menos 3 caracteres' }).optional(),
  number: z.string().min(1, { message: 'Número é obrigatório' }).optional(),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: 'Bairro deve ter pelo menos 2 caracteres' }).optional(),
  city: z.string().min(2, { message: 'Cidade deve ter pelo menos 2 caracteres' }).optional(),
  state: z.string().min(2, { message: 'Estado deve ter pelo menos 2 caracteres' }).optional(),
  zipCode: z.string().min(5, { message: 'CEP deve ter pelo menos 5 caracteres' }).optional(),
  isDefault: z.boolean().optional(),
});

// Schema para resposta do endereço
const addressResponseSchema = z.object({
  id: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string().nullable(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  isDefault: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema para lista de endereços
const addressesResponseSchema = z.array(addressResponseSchema);

// Exportando os tipos para uso no TypeScript
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type AddressResponse = z.infer<typeof addressResponseSchema>;
export type AddressesResponse = z.infer<typeof addressesResponseSchema>;

// Construindo os schemas JSON para o Fastify
export const { schemas: addressSchemas, $ref } = buildJsonSchemas({
  createAddressSchema,
  updateAddressSchema,
  addressResponseSchema,
  addressesResponseSchema
}, { $id: 'addressSchemas' }); 