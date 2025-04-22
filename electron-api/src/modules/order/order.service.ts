import { OrderStatus, Prisma } from '@prisma/client';
import { 
  CreateOrderInput, 
  OrderResponse, 
  OrdersListResponse,
  UpdateOrderStatusInput,
  ListOrdersQuery,
  OrderItemResponse
} from './order.schema';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../utils/prisma';

/**
 * Cria um pedido a partir do carrinho do usuário
 */
export async function createOrder(userId: string, data: CreateOrderInput): Promise<OrderResponse> {
  const { addressId, paymentMethod, shippingCost } = data;

  // Verifica se o usuário existe
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  // Verifica se o endereço existe e pertence ao usuário
  const address = await prisma.address.findFirst({
    where: { 
      id: addressId,
      userId
    }
  });

  if (!address) {
    throw new AppError('Endereço não encontrado ou não pertence ao usuário', 404);
  }

  // Obtém o carrinho do usuário
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Carrinho vazio', 400);
  }

  // Verifica disponibilidade de estoque para todos os itens
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new AppError(`Produto ${item.product.title} não possui estoque suficiente`, 400);
    }
  }

  // Inicia uma transação para garantir consistência dos dados
  const order = await prisma.$transaction(async (tx) => {
    // Cria o pedido
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId,
        paymentMethod,
        shippingCost: new Prisma.Decimal(shippingCost),
        total: cart.total.add(new Prisma.Decimal(shippingCost)),
        status: OrderStatus.PENDING,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        }
      }
    });

    // Atualiza o estoque dos produtos
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    // Limpa o carrinho após a finalização do pedido
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    await tx.cart.update({
      where: { id: cart.id },
      data: { total: new Prisma.Decimal(0) }
    });

    return newOrder;
  });

  return formatOrderResponse(order);
}

/**
 * Obtém um pedido específico pelo ID
 */
export async function getOrderById(orderId: string, userId: string, isAdmin: boolean = false): Promise<OrderResponse> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      }
    }
  });

  if (!order) {
    throw new AppError('Pedido não encontrado', 404);
  }

  // Se não for admin, verifica se o pedido pertence ao usuário
  if (!isAdmin && order.userId !== userId) {
    throw new AppError('Acesso negado', 403);
  }

  return formatOrderResponse(order);
}

/**
 * Lista pedidos com opções de filtragem e paginação
 */
export async function listOrders(userId: string, isAdmin: boolean = false, query: ListOrdersQuery): Promise<OrdersListResponse> {
  const { status, page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  // Define filtros de busca
  const where: Prisma.OrderWhereInput = {};
  
  // Se não for admin, filtra apenas por pedidos do usuário
  if (!isAdmin) {
    where.userId = userId;
  }
  
  // Filtro por status, se fornecido
  if (status) {
    where.status = status;
  }

  // Conta o total de pedidos
  const totalOrders = await prisma.order.count({ where });
  const totalPages = Math.ceil(totalOrders / limit);

  // Busca os pedidos com paginação
  const orders = await prisma.order.findMany({
    where,
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip,
    take: limit
  });

  // Formata a resposta
  return {
    orders: orders.map(order => formatOrderResponse(order)),
    meta: {
      total: totalOrders,
      page,
      limit,
      totalPages
    }
  };
}

/**
 * Atualiza o status de um pedido
 */
export async function updateOrderStatus(orderId: string, userId: string, isAdmin: boolean, data: UpdateOrderStatusInput): Promise<OrderResponse> {
  const { status } = data;

  // Verifica se o pedido existe
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    throw new AppError('Pedido não encontrado', 404);
  }

  // Se não for admin, verifica se o pedido pertence ao usuário
  // E se o usuário está tentando fazer uma alteração permitida (ex: apenas cancelar)
  if (!isAdmin) {
    if (order.userId !== userId) {
      throw new AppError('Acesso negado', 403);
    }

    // Cliente só pode cancelar pedidos no status PENDING
    if (status === OrderStatus.CANCELED && order.status !== OrderStatus.PENDING) {
      throw new AppError('Apenas pedidos pendentes podem ser cancelados pelo cliente', 400);
    }

    // Cliente só pode cancelar, não pode mudar para outros status
    if (status !== OrderStatus.CANCELED) {
      throw new AppError('Operação não permitida para este usuário', 403);
    }
  }

  // Verifica transição de status válida
  validateStatusTransition(order.status, status);

  // Se estiver cancelando o pedido, devolve itens ao estoque
  if (status === OrderStatus.CANCELED && order.status !== OrderStatus.CANCELED) {
    await restoreStock(orderId);
  }

  // Atualiza o status do pedido
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      }
    }
  });

  return formatOrderResponse(updatedOrder);
}

/**
 * Restaura o estoque para pedidos cancelados
 */
async function restoreStock(orderId: string): Promise<void> {
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
    include: { product: true }
  });

  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          increment: item.quantity
        }
      }
    });
  }
}

/**
 * Valida a transição de status do pedido
 */
function validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
  // Mapeamento de transições permitidas
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELED],
    [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPING, OrderStatus.CANCELED],
    [OrderStatus.SHIPPING]: [OrderStatus.DELIVERED, OrderStatus.CANCELED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELED]: []
  };

  if (!allowedTransitions[currentStatus].includes(newStatus) && currentStatus !== newStatus) {
    throw new AppError(`Não é possível alterar o status de ${currentStatus} para ${newStatus}`, 400);
  }
}

/**
 * Formata a resposta de um pedido
 */
function formatOrderResponse(order: any): OrderResponse {
  const formattedItems: OrderItemResponse[] = order.items.map((item: any) => {
    const price = item.price.toNumber();
    const subtotal = price * item.quantity;
    
    return {
      id: item.id,
      product: {
        id: item.product.id,
        title: item.product.title,
        price: item.product.price.toNumber(),
        images: item.product.images.map((img: any) => ({ url: img.url }))
      },
      quantity: item.quantity,
      price,
      subtotal
    };
  });

  return {
    id: order.id,
    user: {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email
    },
    address: order.address ? {
      id: order.address.id,
      street: order.address.street,
      number: order.address.number,
      complement: order.address.complement,
      neighborhood: order.address.neighborhood,
      city: order.address.city,
      state: order.address.state,
      zipCode: order.address.zipCode
    } : null,
    items: formattedItems,
    status: order.status,
    total: order.total.toNumber(),
    shippingCost: order.shippingCost.toNumber(),
    paymentMethod: order.paymentMethod,
    paymentIntentId: order.paymentIntentId,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
} 