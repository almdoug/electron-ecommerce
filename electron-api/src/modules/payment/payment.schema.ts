import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

// Definição dos schemas
const paymentMethodSchema = z.enum(['CREDIT_CARD', 'BOLETO', 'PIX']);

const createPaymentSchema = z.object({
  orderId: z.string().uuid({ message: 'ID do pedido inválido' }),
  paymentMethod: paymentMethodSchema,
});

const processPaymentSchema = z.object({
  orderId: z.string().uuid({ message: 'ID do pedido inválido' }),
  paymentMethod: paymentMethodSchema,
  paymentData: z.object({
    // Dados específicos para CREDIT_CARD
    cardToken: z.string().optional(),
    
    // Informações adicionais para qualquer método
    description: z.string().optional(),
    savePaymentMethod: z.boolean().optional(),
  }).optional(),
});

const paymentResponseSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  amount: z.number(),
  paymentMethod: paymentMethodSchema,
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELED']),
  stripePaymentId: z.string().optional(),
  stripeClientSecret: z.string().optional(),
  receiptUrl: z.string().optional(),
  errorMessage: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const stripeIntentResponseSchema = z.object({
  clientSecret: z.string(),
  paymentId: z.string(),
});

const webhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
});

// Tipos TypeScript inferidos a partir dos schemas
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
export type StripeIntentResponse = z.infer<typeof stripeIntentResponseSchema>;
export type WebhookEvent = z.infer<typeof webhookEventSchema>;

// Construir JSON schemas a partir dos schemas
export const { schemas: paymentSchemas, $ref } = buildJsonSchemas({
  createPaymentSchema,
  processPaymentSchema,
  paymentResponseSchema,
  stripeIntentResponseSchema,
  webhookEventSchema,
}, { $id: 'paymentSchemas' });

// Exporta também os schemas individuais
export {
  createPaymentSchema,
  processPaymentSchema,
  paymentResponseSchema,
  stripeIntentResponseSchema,
  webhookEventSchema
}; 