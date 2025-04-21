import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

// Definição dos schemas
const createUserSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const loginResponseSchema = z.object({
  user: userResponseSchema,
  token: z.string(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

// Exporta tipos TypeScript inferidos a partir dos schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Construir JSON schemas a partir dos schemas
export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  loginSchema,
  userResponseSchema,
  loginResponseSchema,
  updateUserSchema,
}, { $id: 'userSchemas' });

// Exporta também os schemas individuais
export {
  createUserSchema,
  loginSchema,
  userResponseSchema,
  loginResponseSchema,
  updateUserSchema
} 