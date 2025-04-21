import type { Product } from '~/types';

export const useFavorites = () => {
  const favorites = ref<Product[]>([]);

  // Verificar se um produto está nos favoritos
  const isFavorite = (productId: number) => {
    return favorites.value.some(product => product.id === productId);
  };

  // Adicionar um produto aos favoritos
  const addFavorite = (product: Product) => {
    if (!isFavorite(product.id)) {
      favorites.value.push(product);
    }
  };

  // Remover um produto dos favoritos
  const removeFavorite = (productId: number) => {
    const index = favorites.value.findIndex(product => product.id === productId);
    if (index !== -1) {
      favorites.value.splice(index, 1);
    }
  };

  // Alternar o status de favorito de um produto
  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  // Obter o número total de favoritos
  const favoritesCount = computed(() => {
    return favorites.value.length;
  });

  // Limpar todos os favoritos
  const clearFavorites = () => {
    favorites.value = [];
  };

  return {
    favorites,
    favoritesCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites
  };
}; 