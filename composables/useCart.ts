import type { Product, CartItem } from '~/types';

export const useCart = () => {

  const cart = shallowRef<CartItem[]>([]);

  // Carregar itens do carrinho do localStorage
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          cart.value = JSON.parse(savedCart);
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
    }
  });

  // Salvar carrinho no localStorage quando for atualizado
  watch(cart, (newCart) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  }, { deep: true });

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
      // Create a new array to ensure reactivity
      cart.value = [...cart.value];
    } else {
      cart.value = [...cart.value, { product, quantity }];
    }
  };

  // Remover um produto do carrinho
  const removeFromCart = (productId: number) => {
    const index = cart.value.findIndex(item => item.product.id === productId);
    if (index !== -1) {
      const newCart = [...cart.value];
      newCart.splice(index, 1);
      cart.value = newCart;
    }
  };

  // Atualizar a quantidade de um produto no carrinho
  const updateQuantity = (productId: number, quantity: number) => {
    const item = cart.value.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
        // Create a new array to ensure reactivity
        cart.value = [...cart.value];
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