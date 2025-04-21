import { fastify } from 'fastify';
import { userRoutes } from './modules/user/user.route';
import { addressRoutes } from './modules/address/address.route';
import { productRoutes } from './modules/product/product.route';
import { cartRoutes } from './modules/cart/cart.route';
import { orderRoutes } from './modules/order/order.route';
import { shippingRoutes } from './modules/shipping/shipping.route';
import { paymentRoutes } from './modules/payment/payment.route';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { swaggerOptions } from './utils/swagger';
import { version } from '../package.json';

export const server = fastify({
  logger: true,
});

// Registrar plugins
async function registerPlugins() {
  await server.register(cors, {
    origin: true,
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET as string,
  });

  await server.register(swagger, swaggerOptions);
  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
}

// Decorar o fast para obter o usuário a partir do token JWT
server.decorate(
  'authenticate',
  async (request: any, reply: any) => {
    try {
      if (!request.headers.authorization) {
        return reply.code(401).send({ message: 'Token não fornecido. Adicione o cabeçalho Authorization: Bearer <seu_token>' });
      }
      await request.jwtVerify();
    } catch (err) {
      console.error('Erro de autenticação:', err);
      reply.code(401).send({ message: 'Token inválido ou expirado' });
    }
  }
);

// Registrar as rotas
async function registerRoutes() {
  server.register(userRoutes, { prefix: 'api/users' });
  server.register(addressRoutes, { prefix: 'api/addresses' });
  server.register(productRoutes, { prefix: 'api/products' });
  server.register(cartRoutes, { prefix: 'api/cart' });
  server.register(orderRoutes, { prefix: 'api/orders' });
  server.register(shippingRoutes, { prefix: 'api/shipping' });
  server.register(paymentRoutes, { prefix: 'api/payments' });

  // Saúde
  server.get('/health', async () => {
    return { status: 'ok', version };
  });
}

// Iniciar o servidor
async function startServer() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    const host = process.env.HOST || 'localhost';

    await server.listen({ port, host });
    
    console.log(`> Servidor: http://${host}:${port}`);
    console.log(`> Documentação: http://${host}:${port}/docs`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
} 