import { FastifyReply, FastifyRequest } from 'fastify';
import { 
  createUser, 
  findAllUsers, 
  findUserById, 
  updateUser, 
  deleteUser, 
  validatePassword 
} from './user.service';
import { CreateUserInput, LoginInput, UpdateUserInput } from './user.schema';
import { server } from '../../server';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  try {
    const user = await createUser(request.body);
    return reply.code(201).send(user);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  try {
    const user = await validatePassword(request.body);

    // Gerar token JWT
    const token = server.jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
      }
    );

    return reply.code(200).send({
      user,
      token: token,
    });
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(401).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

export async function getUserHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    
    // Verificar se o ID do usuário logado corresponde ao ID requisitado
    // ou se o usuário é um administrador
    const user = await findUserById(id);

    if (!user) {
      return reply.code(404).send({ message: 'Usuário não encontrado' });
    }

    return reply.code(200).send(user);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: UpdateUserInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const currentUser = request.user as { id: string; role: string };

    // Verificar se é o próprio usuário ou um admin
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Acesso negado' });
    }

    const user = await updateUser(id, request.body);
    return reply.code(200).send(user);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

export async function deleteUserHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const currentUser = request.user as { id: string; role: string };

    // Verificar se é o próprio usuário ou um admin
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Acesso negado' });
    }

    await deleteUser(id);
    return reply.code(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
}

export async function getAllUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Verificar se o usuário é administrador
    const currentUser = request.user as { id: string; role: string };
    
    console.log('Usuário atual:', currentUser);
    
    if (!currentUser) {
      return reply.code(403).send({ message: 'Usuário não autenticado corretamente' });
    }
    
    if (currentUser.role !== 'ADMIN') {
      return reply.code(403).send({ message: `Acesso negado. Você tem o papel '${currentUser.role}', mas é necessário 'ADMIN'` });
    }
    
    const users = await findAllUsers();
    return reply.code(200).send(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return reply.code(500).send({ message: 'Erro interno do servidor', error: String(error) });
  }
}

export async function getCurrentUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const currentUser = request.user as { id: string };
    
    const user = await findUserById(currentUser.id);
    
    if (!user) {
      return reply.code(404).send({ message: 'Usuário não encontrado' });
    }
    
    return reply.code(200).send(user);
  } catch (error) {
    return reply.code(500).send({ message: 'Erro interno do servidor' });
  }
} 