import { PrismaClient } from '@prisma/client';

// Instância única do PrismaClient para ser usada em toda a aplicação
export const prisma = new PrismaClient(); 