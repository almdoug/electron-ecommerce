import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createAddress,
  findAddressById,
  findAddressesByUserId,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from './address.service';
import { CreateAddressInput, UpdateAddressInput } from './address.schema';

/**
 * Cria um novo endereço para o usuário autenticado.
 */
export async function createAddressHandler(
  request: FastifyRequest<{
    Body: CreateAddressInput;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const address = await createAddress(userId, request.body);
    return reply.code(201).send(address);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Obtém todos os endereços do usuário autenticado.
 */
export async function getUserAddressesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = (request.user as { id: string }).id;
    const addresses = await findAddressesByUserId(userId);
    return reply.code(200).send(addresses);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Obtém um endereço específico pelo ID.
 */
export async function getAddressByIdHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const userId = (request.user as { id: string }).id;
    
    const address = await findAddressById(id);
    
    if (!address) {
      return reply.code(404).send({ message: 'Endereço não encontrado' });
    }
    
    // Verificar se o endereço pertence ao usuário
    if (address.userId !== userId) {
      return reply.code(403).send({ message: 'Acesso negado a este endereço' });
    }
    
    return reply.code(200).send(address);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Atualiza um endereço existente.
 */
export async function updateAddressHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: UpdateAddressInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const userId = (request.user as { id: string }).id;
    
    const address = await updateAddress(id, userId, request.body);
    return reply.code(200).send(address);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Exclui um endereço.
 */
export async function deleteAddressHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const userId = (request.user as { id: string }).id;
    
    await deleteAddress(id, userId);
    return reply.code(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

/**
 * Define um endereço como padrão.
 */
export async function setDefaultAddressHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const userId = (request.user as { id: string }).id;
    
    const address = await setDefaultAddress(id, userId);
    return reply.code(200).send(address);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
} 