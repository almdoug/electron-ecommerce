import { ref, computed } from 'vue';
import type { Product, CartItem } from '~/types';

export const useCart = () => {
  const cart = ref<CartItem[]>([]);

  // Obter o número total de itens no carrinho
  const cartItemCount = computed(() => {
    return cart.value.reduce((acc, item) => acc + item.quantity, 0);
  });

  // Obter o valor total do carrinho
  const cartTotal = computed(() => {
    return cart.value.reduce((acc, item) => {
      const price = item.product.discountedPrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);
  });

  // Adicionar um produto ao carrinho
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.value.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.value.push({ product, quantity });
    }
  };

  // Remover um produto do carrinho
  const removeFromCart = (productId: number) => {
    const index = cart.value.findIndex(item => item.product.id === productId);
    if (index !== -1) {
      cart.value.splice(index, 1);
    }
  };

  // Atualizar a quantidade de um produto no carrinho
  const updateQuantity = (productId: number, quantity: number) => {
    const item = cart.value.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      // Se a quantidade for 0 ou negativa, remove o item
      if (quantity <= 0) {
        removeFromCart(productId);
      }
    }
  };

  // Limpar o carrinho
  const clearCart = () => {
    cart.value = [];
  };

  // Verificar se um produto está no carrinho
  const isInCart = (productId: number) => {
    return cart.value.some(item => item.product.id === productId);
  };

  return {
    cart,
    cartItemCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart
  };
}; 