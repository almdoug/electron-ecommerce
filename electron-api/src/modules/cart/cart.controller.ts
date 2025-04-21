import { FastifyReply, FastifyRequest } from 'fastify';
import {
  getOrCreateCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from './cart.service';
import { AddToCartInput, CartItemIdParam, UpdateCartItemInput } from './cart.schema';
import { AppError } from '../../utils/AppError';

/**
 * Obtém o carrinho do usuário atual
 */
export async function getCartHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const cart = await getOrCreateCart(userId);
    return reply.code(200).send(cart);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Adiciona um item ao carrinho
 */
export async function addToCartHandler(
  request: FastifyRequest<{
    Body: AddToCartInput;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const cart = await addToCart(userId, request.body);
    return reply.code(200).send(cart);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Atualiza a quantidade de um item no carrinho
 */
export async function updateCartItemHandler(
  request: FastifyRequest<{
    Params: CartItemIdParam;
    Body: UpdateCartItemInput;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const { itemId } = request.params;
    const cart = await updateCartItem(userId, itemId, request.body);
    return reply.code(200).send(cart);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Remove um item do carrinho
 */
export async function removeCartItemHandler(
  request: FastifyRequest<{
    Params: CartItemIdParam;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const { itemId } = request.params;
    const cart = await removeCartItem(userId, itemId);
    return reply.code(200).send(cart);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Limpa o carrinho do usuário
 */
export async function clearCartHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const cart = await clearCart(userId);
    return reply.code(200).send(cart);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
} 