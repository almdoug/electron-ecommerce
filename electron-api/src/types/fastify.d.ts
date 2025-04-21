import fastify from 'fastify';
import { JWT } from '@fastify/jwt';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (request: fastify.FastifyRequest, reply: fastify.FastifyReply) => Promise<void>;
    jwt: JWT;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
} 