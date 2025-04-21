import { PrismaClient, Address } from '@prisma/client';
import { CreateAddressInput, UpdateAddressInput } from './address.schema';

const prisma = new PrismaClient();

// Verifica se um endereço existe pelo ID e pertence ao usuário
async function addressExists(id: string, userId: string): Promise<Address> {
  const address = await prisma.address.findFirst({
    where: { 
      id,
      userId
    }
  });

  if (!address) {
    throw new Error('Endereço não encontrado ou não pertence ao usuário');
  }

  return address;
}


// Cria um novo endereço para o usuário.
export async function createAddress(userId: string, data: CreateAddressInput): Promise<Address> {
  // Verificar se o usuário existe
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Se for definido como padrão, resetar outros endereços padrão
  if (data.isDefault) {
    await resetDefaultAddresses(userId);
  }

  // Criar o endereço
  return prisma.address.create({
    data: {
      ...data,
      userId
    }
  });
}

// Busca todos os endereços de um usuário.
export async function findAddressesByUserId(userId: string): Promise<Address[]> {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }
  });
}

// Busca um endereço pelo ID.
export async function findAddressById(id: string): Promise<Address | null> {
  return prisma.address.findUnique({
    where: { id }
  });
}

// Atualiza um endereço.
export async function updateAddress(
  id: string, 
  userId: string, 
  data: UpdateAddressInput
): Promise<Address> {
  // Verificar se o endereço existe e pertence ao usuário
  await addressExists(id, userId);

  // Se for definido como padrão, resetar outros endereços padrão
  if (data.isDefault) {
    await resetDefaultAddresses(userId);
  }

  // Atualizar o endereço
  return prisma.address.update({
    where: { id },
    data
  });
}

// Exclui um endereço.
export async function deleteAddress(id: string, userId: string): Promise<boolean> {
  // Verificar se o endereço existe e pertence ao usuário
  const address = await addressExists(id, userId);

  // Verificar se o endereço está sendo usado em algum pedido
  const isUsedInOrder = await prisma.order.findFirst({
    where: { addressId: id }
  });

  if (isUsedInOrder) {
    throw new Error('Este endereço não pode ser excluído pois está associado a um pedido');
  }

  // Excluir o endereço
  await prisma.address.delete({
    where: { id }
  });

  // Se o endereço excluído era o padrão, definir outro como padrão (se existir)
  if (address.isDefault) {
    const remainingAddress = await prisma.address.findFirst({
      where: { userId }
    });

    if (remainingAddress) {
      await prisma.address.update({
        where: { id: remainingAddress.id },
        data: { isDefault: true }
      });
    }
  }

  return true;
}

// Define um endereço como padrão.
export async function setDefaultAddress(id: string, userId: string): Promise<Address> {
  // Verificar se o endereço existe e pertence ao usuário
  await addressExists(id, userId);

  // Resetar outros endereços padrão
  await resetDefaultAddresses(userId);

  // Definir este endereço como padrão
  return prisma.address.update({
    where: { id },
    data: { isDefault: true }
  });
}

// Reseta todos os endereços padrão do usuário.
async function resetDefaultAddresses(userId: string): Promise<void> {
  await prisma.address.updateMany({
    where: {
      userId,
      isDefault: true
    },
    data: {
      isDefault: false
    }
  });
} 