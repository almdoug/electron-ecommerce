import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrderStatus
} from './order.service';
import { 
  CreateOrderInput, 
  OrderIdParam, 
  UpdateOrderStatusInput,
  ListOrdersQuery
} from './order.schema';
import { AppError } from '../../utils/AppError';

/**
 * Cria um novo pedido a partir do carrinho do usuário
 */
export async function createOrderHandler(
  request: FastifyRequest<{
    Body: CreateOrderInput;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const order = await createOrder(userId, request.body);
    return reply.code(201).send(order);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Obtém os detalhes de um pedido específico
 */
export async function getOrderHandler(
  request: FastifyRequest<{
    Params: OrderIdParam;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const isAdmin = (request.user as { role: string }).role === 'ADMIN';
    const { orderId } = request.params;

    const order = await getOrderById(orderId, userId, isAdmin);
    return reply.code(200).send(order);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Lista os pedidos do usuário ou todos os pedidos (para admin)
 */
export async function listOrdersHandler(
  request: FastifyRequest<{
    Querystring: ListOrdersQuery;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const isAdmin = (request.user as { role: string }).role === 'ADMIN';

    const orders = await listOrders(userId, isAdmin, request.query);
    return reply.code(200).send(orders);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Atualiza o status de um pedido
 */
export async function updateOrderStatusHandler(
  request: FastifyRequest<{
    Params: OrderIdParam;
    Body: UpdateOrderStatusInput;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const isAdmin = (request.user as { role: string }).role === 'ADMIN';
    const { orderId } = request.params;

    const order = await updateOrderStatus(orderId, userId, isAdmin, request.body);
    return reply.code(200).send(order);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
} 