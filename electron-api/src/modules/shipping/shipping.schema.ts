import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

// Definindo o enum localmente
export enum ShippingServiceType {
  PAC = 'PAC',
  SEDEX = 'SEDEX',
  SEDEX_10 = 'SEDEX_10',
  PICK_UP = 'PICK_UP'
}

// Schema para cálculo de frete
const calculateShippingSchema = z.object({
  zipCode: z.string().min(8, { message: 'CEP deve ter no mínimo 8 caracteres' }),
  items: z.array(z.object({
    productId: z.string().uuid({ message: 'ID do produto inválido' }),
    quantity: z.number().int().min(1, { message: 'Quantidade deve ser pelo menos 1' })
  })).min(1, { message: 'Deve haver pelo menos um item' })
});

// Schema para resposta de serviço de entrega individual
const shippingServiceResponseSchema = z.object({
  serviceType: z.nativeEnum(ShippingServiceType),
  price: z.number().min(0, { message: 'Preço não pode ser negativo' }),
  deliveryTimeInDays: z.number().int().min(1, { message: 'Tempo de entrega deve ser pelo menos 1 dia' }),
  isFree: z.boolean(),
  discountApplied: z.boolean(),
  originalPrice: z.number().min(0).optional()
});

// Schema para resposta completa de cálculo de frete
const shippingCalculationResponseSchema = z.object({
  destination: z.object({
    zipCode: z.string(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
  availableServices: z.array(shippingServiceResponseSchema),
  totalWeight: z.number().min(0),
  totalItems: z.number().int().min(1),
  freeShippingEligible: z.boolean()
});

// Schema para validação de CEP
const zipCodeValidationSchema = z.object({
  zipCode: z.string().min(8, { message: 'CEP deve ter no mínimo 8 caracteres' })
});

// Schema para resposta de validação de CEP
const zipCodeValidationResponseSchema = z.object({
  valid: z.boolean(),
  zipCode: z.string(),
  address: z.object({
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional()
  }).optional()
});

// Schema para regras de frete grátis
const freeShippingRuleSchema = z.object({
  minOrderValue: z.number().min(0),
  regions: z.array(z.string()).optional(),
  productCategories: z.array(z.string()).optional(),
  serviceTypes: z.array(z.nativeEnum(ShippingServiceType)).optional(),
  active: z.boolean().default(true),
  name: z.string().min(3),
  description: z.string().optional()
});

// Schema para resposta de regras de frete grátis
const freeShippingRuleResponseSchema = z.object({
  id: z.string(),
  minOrderValue: z.number(),
  regions: z.array(z.string()).optional(),
  productCategories: z.array(z.string()).optional(),
  serviceTypes: z.array(z.nativeEnum(ShippingServiceType)).optional(),
  active: z.boolean(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string())
});

// Schema para listar regras de frete grátis
const freeShippingRulesResponseSchema = z.array(freeShippingRuleResponseSchema);

// Exportando os tipos para uso no TypeScript
export type CalculateShippingInput = z.infer<typeof calculateShippingSchema>;
export type ShippingServiceResponse = z.infer<typeof shippingServiceResponseSchema>;
export type ShippingCalculationResponse = z.infer<typeof shippingCalculationResponseSchema>;
export type ZipCodeValidationInput = z.infer<typeof zipCodeValidationSchema>;
export type ZipCodeValidationResponse = z.infer<typeof zipCodeValidationResponseSchema>;
export type FreeShippingRuleInput = z.infer<typeof freeShippingRuleSchema>;
export type FreeShippingRuleResponse = z.infer<typeof freeShippingRuleResponseSchema>;

// Construindo os schemas JSON para o Fastify
export const { schemas: shippingSchemas, $ref } = buildJsonSchemas({
  calculateShippingSchema,
  shippingServiceResponseSchema,
  shippingCalculationResponseSchema,
  zipCodeValidationSchema,
  zipCodeValidationResponseSchema,
  freeShippingRuleSchema,
  freeShippingRuleResponseSchema,
  freeShippingRulesResponseSchema
}, { $id: 'shippingSchemas' }); 