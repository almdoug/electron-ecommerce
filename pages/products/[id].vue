<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 mb-8">
            <NuxtLink to="/" class="text-gray-500 hover:text-primary">Home</NuxtLink>
            <span class="text-gray-500">&gt;</span>
            <NuxtLink to="/products" class="text-gray-500 hover:text-primary">All category</NuxtLink>
            <span v-if="product" class="text-gray-500">&gt;</span>
            <span v-if="product" class="text-gray-700">{{ product.title }}</span>
        </div>

        <div v-if="product" class="flex flex-col md:flex-row gap-8 mb-10">
            <!-- Product Images Section -->
            <div class="md:w-1/2">
                <div class="border border-gray-300 rounded-xl p-4 mb-4">
                    <div class="flex items-center justify-center">
                        <NuxtImg :src="currentImage || product.images[0]" :alt="product.title" class="h-80 object-contain" />
                    </div>
                </div>
                <div class="flex gap-4 mt-2">
                    <button 
                        v-for="(image, index) in product.images" 
                        :key="index"
                        @click="currentImage = image" 
                        class="border border-gray-300 rounded-lg overflow-hidden w-24 h-24 flex items-center justify-center"
                        :class="{'border-primary': currentImage === image}"
                    >
                        <NuxtImg :src="image" :alt="`${product.title} - Image ${index + 1}`" class="h-20 object-contain" />
                    </button>
                </div>
            </div>

            <!-- Product Details Section -->
            <div class="md:w-1/2">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ product.title }}</h1>
                <div class="text-2xl font-bold text-gray-900 mb-2">
                    {{ formatPrice(product.discountedPrice || product.price) }}
                    <span v-if="product.discountedPrice" class="text-lg text-gray-500 line-through ml-2">
                        {{ formatPrice(product.price) }}
                    </span>
                </div>
                
                <div class="flex items-center gap-2 mb-4">
                    <StarRating :rating="product.rating" emptyColorClass="text-zinc-300" />
                    <span class="text-sm text-gray-500">No reviews</span>
                </div>

                <div class="flex items-center gap-3 mb-4">
                    <span class="text-gray-700">Availability:</span>
                    <div class="flex items-center" :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
                        <icon :name="product.stock > 0 ? 'ph:check' : 'ph:x'" class="mr-1" />
                        <span>{{ product.stock > 0 ? 'In stock' : 'Out of stock' }}</span>
                    </div>
                </div>

                <div v-if="product.stock > 0" class="text-gray-600 mb-4">
                    <p>Hurry up! only {{ product.stock }} {{ product.stock === 1 ? 'product' : 'products' }} left in stock!</p>
                </div>

                <div class="text-gray-700 mb-6">
                    <p>{{ product.description }}</p>
                </div>

                <!-- Color Selection -->
                <div class="mb-4">
                    <div class="text-gray-700 mb-2">Color:</div>
                    <div class="flex gap-2">
                        <button
                            class="w-6 h-6 rounded-full bg-lime-500 border-2 border-white outline-2 outline-lime-500"></button>
                        <button class="w-6 h-6 rounded-full bg-gray-800 border border-gray-300"></button>
                    </div>
                </div>

                <!-- Size Selection -->
                <div class="mb-6">
                    <div class="text-gray-700 mb-2">Size:</div>
                    <div class="flex gap-2">
                        <button
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-primary hover:text-primary">30</button>
                        <button
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-primary hover:text-primary">56</button>
                        <button
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-primary hover:text-primary">42</button>
                        <button
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-primary hover:text-primary">48</button>
                    </div>
                </div>

                <!-- Quantity Selector -->
                <div class="mb-6">
                    <div class="text-gray-700 mb-2">Quantity:</div>
                    <div class="flex items-center">
                        <button 
                            @click="quantity > 1 ? quantity-- : null" 
                            class="px-3 py-2 border border-gray-300 rounded-l-lg"
                            :disabled="product.stock === 0"
                        >
                            <icon name="ph:minus" />
                        </button>
                        <input 
                            v-model="quantity" 
                            type="text"
                            :disabled="product.stock === 0"
                            class="w-12 border-t border-b border-gray-300 py-2 text-center" 
                        />
                        <button 
                            @click="quantity < product.stock ? quantity++ : null" 
                            class="px-3 py-2 border border-gray-300 rounded-r-lg"
                            :disabled="product.stock === 0 || quantity >= product.stock"
                        >
                            <icon name="ph:plus" />
                        </button>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4 mb-6">
                    <button 
                        @click="addProductToCart" 
                        class="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 flex items-center justify-center"
                        :disabled="product.stock === 0"
                        :class="{'opacity-50 cursor-not-allowed': product.stock === 0}"
                    >
                        Add to cart
                    </button>
                    <button 
                        class="bg-orange-100 text-orange-500 py-3 px-6 rounded-lg hover:bg-orange-200 flex items-center justify-center"
                        :disabled="product.stock === 0"
                        :class="{'opacity-50 cursor-not-allowed': product.stock === 0}"
                    >
                        Buy it now
                    </button>
                    <button 
                        @click="toggleFavorite" 
                        class="border border-gray-300 rounded-full p-3 hover:bg-gray-100"
                    >
                        <icon :name="isFavorite(product.id) ? 'ph:heart-fill' : 'ph:heart'" :class="isFavorite(product.id) ? 'text-primary' : ''" />
                    </button>
                </div>

                <!-- Product Info -->
                <div class="border-t border-gray-200 pt-4">
                    <div class="mb-2">
                        <span class="text-gray-600">Sku:</span>
                        <span class="ml-2 text-gray-800">PRD-{{ product.id.toString().padStart(5, '0') }}</span>
                    </div>
                    <div class="mb-2">
                        <span class="text-gray-600">Category:</span>
                        <span class="ml-2 text-blue-600">{{ product.category }}</span>
                        <span v-if="product.discountedPrice" class="ml-2 text-blue-600">
                            {{ Math.round(((product.price - product.discountedPrice) / product.price) * 100) }}% off
                        </span>
                    </div>
                    <div class="mb-2">
                        <span class="text-gray-600">Share:</span>
                        <div class="inline-flex ml-2 gap-2">
                            <button class="text-gray-600 hover:text-blue-600">
                                <icon name="ph:facebook-logo" />
                            </button>
                            <button class="text-gray-600 hover:text-blue-400">
                                <icon name="ph:twitter-logo" />
                            </button>
                            <button class="text-gray-600 hover:text-green-600">
                                <icon name="ph:whatsapp-logo" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex justify-center items-center h-64">
            <p class="text-xl text-gray-500">Product not found</p>
        </div>

        <!-- Product Tabs -->
        <div v-if="product" class="mb-12">
            <div class="flex border-b border-gray-200 mb-6">
                <button @click="activeTab = 'description'" class="py-3 px-6 font-medium hover:text-primary"
                    :class="activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'">
                    Description
                </button>
                <button @click="activeTab = 'reviews'" class="py-3 px-6 font-medium hover:text-primary"
                    :class="activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'">
                    Reviews
                </button>
            </div>

            <div v-if="activeTab === 'description'" class="text-gray-600">
                <p>{{ product.description }}</p>
            </div>

            <div v-if="activeTab === 'reviews'" class="text-gray-600">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Customer reviews</h3>
                <p class="mb-4">No reviews yet</p>
                <button class="bg-blue-800 text-white px-4 py-2 rounded">Write a review</button>
            </div>
        </div>

        <!-- Related Products -->
        <div v-if="product">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Related products</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ProductCard 
                    v-for="relatedProduct in relatedProducts" 
                    :key="relatedProduct.id" 
                    :product="relatedProduct" 
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import StarRating from '~/components/ui/StarRating.vue';
import ProductCard from '~/components/ui/ProductCard.vue';
import { usePrice } from '~/composables/usePrice';
import { useCart } from '~/composables/useCart';
import { useFavorites } from '~/composables/useFavorites';
import { useNotification } from '~/composables/useNotification';
import { products } from '~/mock/products';

definePageMeta({
    layout: 'default'
});

const route = useRoute();
const { formatPrice } = usePrice();
const { addToCart } = useCart();
const { isFavorite, toggleFavorite: toggleProductFavorite } = useFavorites();
const { success } = useNotification();

const productId = ref(parseInt(route.params.id as string) || 1);
const quantity = ref(1);
const activeTab = ref('description');
const currentImage = ref('');

// Find product by ID
const product = computed(() => {
    return products.find(p => p.id === productId.value);
});

// Get related products (same category, excluding current product)
const relatedProducts = computed(() => {
    if (!product.value) return [];
    
    return products
        .filter(p => p.category === product.value?.category && p.id !== product.value?.id)
        .slice(0, 4);
});

const addProductToCart = () => {
    if (product.value) {
        addToCart(product.value, quantity.value);
        success(`Product "${product.value.title}" added to cart!`);
    }
};

const toggleFavorite = () => {
    if (product.value) {
        toggleProductFavorite(product.value);
    }
};

onMounted(() => {
    // Set current image to first product image on mount
    if (product.value && product.value.images.length > 0) {
        currentImage.value = product.value.images[0];
    }
    
    // Reset quantity to 1 when product changes
    quantity.value = 1;
});
</script>