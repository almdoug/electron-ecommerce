import { Prisma } from '@prisma/client';
import { AddToCartInput, CartItemResponse, CartResponse, UpdateCartItemInput } from './cart.schema';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../utils/prisma';

/**
 * Obtém ou cria um carrinho para o usuário
 */
export async function getOrCreateCart(userId: string): Promise<CartResponse> {
  // Verifica se o usuário existe
  const userExists = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!userExists) {
    throw new AppError('Usuário não encontrado', 404);
  }

  // Busca o carrinho do usuário ou cria um novo
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
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

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        total: 0
      },
      include: {
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
  }

  return formatCartResponse(cart);
}

/**
 * Adiciona um produto ao carrinho
 */
export async function addToCart(userId: string, data: AddToCartInput): Promise<CartResponse> {
  const { productId, quantity } = data;

  // Verifica se o produto existe e tem estoque
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError('Produto não encontrado', 404);
  }

  if (product.stock < quantity) {
    throw new AppError('Quantidade solicitada indisponível em estoque', 400);
  }

  // Obtém ou cria um carrinho para o usuário
  const cart = await getOrCreateCart(userId);

  // Verifica se o produto já está no carrinho
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId
    }
  });

  let updatedCart;

  if (existingItem) {
    // Atualiza a quantidade se o item já existe
    const newQuantity = existingItem.quantity + quantity;
    
    if (product.stock < newQuantity) {
      throw new AppError('Quantidade solicitada indisponível em estoque', 400);
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: newQuantity
      }
    });
  } else {
    // Adiciona um novo item ao carrinho
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price: product.discountedPrice || product.price
      }
    });
  }

  // Recalcula o total e retorna o carrinho atualizado
  return await recalculateCartTotal(cart.id);
}

/**
 * Atualiza a quantidade de um item no carrinho
 */
export async function updateCartItem(userId: string, itemId: string, data: UpdateCartItemInput): Promise<CartResponse> {
  const { quantity } = data;

  // Obtém o carrinho do usuário
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    throw new AppError('Carrinho não encontrado', 404);
  }

  // Verifica se o item existe e pertence ao carrinho do usuário
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id
    },
    include: {
      product: true
    }
  });

  if (!cartItem) {
    throw new AppError('Item não encontrado no carrinho', 404);
  }

  // Verifica se há estoque suficiente
  if (cartItem.product.stock < quantity) {
    throw new AppError('Quantidade solicitada indisponível em estoque', 400);
  }

  // Atualiza a quantidade do item
  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity }
  });

  // Recalcula o total e retorna o carrinho atualizado
  return await recalculateCartTotal(cart.id);
}

/**
 * Remove um item do carrinho
 */
export async function removeCartItem(userId: string, itemId: string): Promise<CartResponse> {
  // Obtém o carrinho do usuário
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    throw new AppError('Carrinho não encontrado', 404);
  }

  // Verifica se o item existe e pertence ao carrinho do usuário
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id
    }
  });

  if (!cartItem) {
    throw new AppError('Item não encontrado no carrinho', 404);
  }

  // Remove o item do carrinho
  await prisma.cartItem.delete({
    where: { id: itemId }
  });

  // Recalcula o total e retorna o carrinho atualizado
  return await recalculateCartTotal(cart.id);
}

/**
 * Limpa o carrinho do usuário
 */
export async function clearCart(userId: string): Promise<CartResponse> {
  // Obtém o carrinho do usuário
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    throw new AppError('Carrinho não encontrado', 404);
  }

  // Remove todos os itens do carrinho
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  // Atualiza o total para zero
  await prisma.cart.update({
    where: { id: cart.id },
    data: { total: 0 }
  });

  // Retorna o carrinho vazio
  return await getOrCreateCart(userId);
}

/**
 * Recalcula o total do carrinho
 */
async function recalculateCartTotal(cartId: string): Promise<CartResponse> {
  // Busca todos os itens do carrinho
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId },
    include: {
      product: {
        include: {
          images: true
        }
      }
    }
  });

  // Calcula o total
  let total = 0;
  for (const item of cartItems) {
    const price = item.product.discountedPrice || item.product.price;
    const subtotal = price.toNumber() * item.quantity;
    total += subtotal;

    // Atualiza o preço do item caso o preço do produto tenha mudado
    if (!item.price.equals(price)) {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { price }
      });
    }
  }

  // Atualiza o total do carrinho
  const updatedCart = await prisma.cart.update({
    where: { id: cartId },
    data: { total: new Prisma.Decimal(total) },
    include: {
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

  return formatCartResponse(updatedCart);
}

/**
 * Formata a resposta do carrinho
 */
function formatCartResponse(cart: any): CartResponse {
  const formattedItems: CartItemResponse[] = cart.items.map((item: any) => {
    const price = item.price.toNumber();
    const subtotal = price * item.quantity;
    
    return {
      id: item.id,
      product: {
        id: item.product.id,
        title: item.product.title,
        price: item.product.price.toNumber(),
        discountedPrice: item.product.discountedPrice ? item.product.discountedPrice.toNumber() : null,
        images: item.product.images.map((img: any) => ({ url: img.url }))
      },
      quantity: item.quantity,
      price,
      subtotal
    };
  });

  return {
    id: cart.id,
    items: formattedItems,
    total: cart.total.toNumber(),
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt
  };
} 