<template>
  <div class="rounded-2xl p-4 relative border border-zinc-300 group">
    <button
      class="absolute flex items-center justify-center p-2 rounded-full bg-primary-system top-6 right-6 text-zinc-800 hover:text-primary"
      @click="toggleFavorite">
      <icon :name="isFavorite(product.id) ? 'ph:heart-fill' : 'ph:heart'" size="15"
        :class="isFavorite(product.id) ? 'text-primary' : ''" />
    </button>
    <div class="mb-4 p-4">
      <NuxtLink :to="`/products/${product.id}`">
        <NuxtImg :src="product.images[0]" :alt="product.title" class="w-full h-48 object-contain" />
      </NuxtLink>
    </div>
    <div class="space-y-2 relative">
      <div class="transition-opacity duration-300 group-hover:opacity-0">
        <h3 class="font-medium text-gray-700">
          <NuxtLink :to="`/products/${product.id}`" class="hover:text-secondary">
            {{ product.title }}
          </NuxtLink>
        </h3>
        <div class="flex items-center gap-2">
          <p class="font-semibold text-blue-900">
            {{ formatPrice(product.discountedPrice || product.price) }}
          </p>
          <p v-if="product.discountedPrice" class="text-gray-500 text-sm line-through">
            {{ formatPrice(product.price) }}
          </p>
        </div>
        <StarRating :rating="product.rating" emptyColorClass="text-zinc-300" />
      </div>

      <div
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
        <button
          class="bg-primary-system hover:border-secondary text-zinc-800 py-2 rounded-xl flex-grow flex items-center justify-center"
          @click="addToCart"
          :class="{'bg-green-100': isAdded}">
          {{ isAdded ? 'Added' : 'Add to cart' }}
          <div class="flex items-center justify-center p-2 rounded-full bg-secondary ml-3 text-white">
            <icon :name="isAdded ? 'ph:check' : 'ph:shopping-cart'" />
          </div>
        </button>
        <NuxtLink :to="`/products/${product.id}`"
          class="flex items-center bg-primary-system p-4 rounded-xl hover:border-primary hover:text-primary">
          <icon name="ph:eye" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types';
import { useCart } from '~/composables/useCart';
import { usePrice } from '~/composables/usePrice';
import { useFavorites } from '~/composables/useFavorites';
import { useNotification } from '~/composables/useNotification';
import StarRating from '~/components/ui/StarRating.vue';

const props = defineProps<{
  product: Product;
}>();

const { addToCart: addProductToCart } = useCart();
const { formatPrice, getDisplayPrice } = usePrice();
const { isFavorite, toggleFavorite: toggleProductFavorite } = useFavorites();
const { success } = useNotification();

const isAdded = ref(false);

const addToCart = () => {
  addProductToCart(props.product);
  success(`Product "${props.product.title}" added to cart!`);
  
  // Visual feedback: change button text temporarily
  isAdded.value = true;
  setTimeout(() => {
    isAdded.value = false;
  }, 2000);
};

const toggleFavorite = () => {
  toggleProductFavorite(props.product);
};
</script>