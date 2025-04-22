import { User } from '@prisma/client';
import { CreateUserInput, LoginInput, UpdateUserInput, UserResponse } from './user.schema';
import { hash, compare } from 'bcryptjs';
import { prisma } from '../../utils/prisma';

// Remove a senha do objeto de usuário
function excludePassword(user: User): UserResponse {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as UserResponse;
}

// Verifica se um usuário existe pelo ID
async function userExists(id: string): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error('Usuário não encontrado');
  }

  return existingUser;
}

export async function createUser(input: CreateUserInput): Promise<UserResponse> {
  // Verifica se o usuário já existe
  const exists = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (exists) {
    throw new Error('Usuário com este email já existe');
  }

  // Hash da senha
  const hashedPassword = await hash(input.password, 10);

  // Cria usuário
  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      password: hashedPassword,
    },
  });

  return excludePassword(user);
}

export async function validatePassword({
  email,
  password,
}: LoginInput): Promise<UserResponse> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    throw new Error('Credenciais inválidas');
  }

  return excludePassword(user);
}

export async function findUserById(id: string): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return null;
  }

  return excludePassword(user);
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<UserResponse> {
  // Verifica se o usuário existe
  await userExists(id);

  // Prepara dados para atualização
  const updateData: any = { ...data };

  // Se tiver senha, faz o hash
  if (updateData.password) {
    updateData.password = await hash(updateData.password, 10);
  }

  // Atualiza usuário
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: updateData,
  });

  return excludePassword(updatedUser);
}

export async function deleteUser(id: string): Promise<boolean> {
  // Verifica se o usuário existe
  await userExists(id);

  // Deleta usuário
  await prisma.user.delete({
    where: {
      id,
    },
  });

  return true;
}

export async function findAllUsers(): Promise<UserResponse[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return users as UserResponse[];
} 