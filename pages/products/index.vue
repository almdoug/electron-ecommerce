<template>
    <div>
        <div class="container mx-auto px-4 py-8">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-8">
                <NuxtLink to="/" class="text-gray-500 hover:text-primary">Home</NuxtLink>
                <span class="text-gray-500">&gt;</span>
                <span class="text-gray-700">All category</span>
            </div>

            <div class="flex gap-6">
                <!-- Filters Sidebar -->
                <div class="w-1/4">
                    <div class="mb-8">
                        <h3 class="font-medium text-lg mb-4">Categories</h3>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <input type="checkbox" id="all-categories" :checked="activeCategory === 'all'"
                                    @change="setCategory('all')" class="mr-2" />
                                <label for="all-categories" class="text-gray-700">All categories</label>
                                <span class="ml-auto text-gray-500">{{ products.length }}</span>
                            </div>
                            <div v-for="category in categories" :key="category.id" class="flex items-center">
                                <input type="checkbox" :id="category.slug" :checked="activeCategory === category.slug"
                                    @change="setCategory(category.slug)" class="mr-2" />
                                <label :for="category.slug" class="text-gray-700">{{ category.name }}</label>
                                <span class="ml-auto text-gray-500">{{ category.itemCount }}</span>
                            </div>
                        </div>
                        <div class="flex justify-end mt-2">
                            <button @click="resetFilters" class="text-sm text-gray-500 hover:text-primary">
                                Reset
                            </button>
                        </div>
                    </div>

                    <div class="mb-8">
                        <h3 class="font-medium text-lg mb-4">Availability</h3>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <span class="text-gray-500">{{ availabilityFilters.length }} selected</span>
                                <button @click="availabilityFilters = []"
                                    class="text-sm text-gray-500 hover:text-primary ml-auto">
                                    Reset
                                </button>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="in-stock" v-model="availabilityFilters" value="in-stock"
                                    class="mr-2" />
                                <label for="in-stock" class="text-gray-700">In stock</label>
                                <span class="ml-auto text-gray-500">{{ inStockCount }}</span>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="out-of-stock" v-model="availabilityFilters"
                                    value="out-of-stock" class="mr-2" />
                                <label for="out-of-stock" class="text-gray-700">Out of stock</label>
                                <span class="ml-auto text-gray-500">{{ outOfStockCount }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mb-8">
                        <h3 class="font-medium text-lg mb-4">Price Range</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span>${{ priceRange[0] }}</span>
                                <span>${{ priceRange[1] }}</span>
                            </div>
                            <div class="px-2">
                                <!-- Simple price range display for now -->
                                <div class="h-2 bg-gray-200 rounded-full">
                                    <div class="h-2 bg-primary rounded-full"
                                        :style="`width: ${(priceRange[1] / maxPrice) * 100}%`"></div>
                                </div>
                            </div>
                            <div class="flex space-x-4">
                                <input type="number" v-model.number="priceRange[0]" min="0" :max="priceRange[1]"
                                    class="w-full border border-gray-300 rounded p-2" />
                                <input type="number" v-model.number="priceRange[1]" :min="priceRange[0]" :max="maxPrice"
                                    class="w-full border border-gray-300 rounded p-2" />
                            </div>
                        </div>
                    </div>

                    <div class="mb-8">
                        <h3 class="font-medium text-lg mb-4">Color</h3>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <span class="text-gray-500">{{ selectedColors.length }} selected</span>
                                <button @click="selectedColors = []"
                                    class="text-sm text-gray-500 hover:text-primary ml-auto">
                                    Reset
                                </button>
                            </div>
                            <div class="flex items-center gap-2 mt-2">
                                <button v-for="color in colors" :key="color.value" @click="toggleColor(color.value)"
                                    :class="[
                                        'w-6 h-6 rounded-full border',
                                        selectedColors.includes(color.value) ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-300'
                                    ]" :style="`background-color: ${color.hex}`"></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Products Grid -->
                <div class="w-3/4">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <span class="text-gray-700">Showing {{ filteredProducts.length }} of {{ products.length }}
                                products</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-700">Sort by:</span>
                            <select v-model="sortOption" class="border border-gray-300 rounded p-2">
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="price-asc">Price (Low to High)</option>
                                <option value="price-desc">Price (High to Low)</option>
                                <option value="rating-desc">Top Rated</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
                    </div>

                    <!-- Pagination -->
                    <div class="flex justify-center mt-8">
                        <div class="flex space-x-1">
                            <button @click="currentPage = 1" :disabled="currentPage === 1"
                                class="px-4 py-2 border border-gray-300 rounded-lg"
                                :class="currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-50'">
                                First
                            </button>
                            <button @click="currentPage--" :disabled="currentPage === 1"
                                class="px-4 py-2 border border-gray-300 rounded-lg"
                                :class="currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-50'">
                                Previous
                            </button>
                            <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                                class="px-4 py-2 border rounded-lg"
                                :class="currentPage === page ? 'bg-primary text-white' : 'border-gray-300 hover:bg-gray-50'">
                                {{ page }}
                            </button>
                            <button @click="currentPage++" :disabled="currentPage === totalPages"
                                class="px-4 py-2 border border-gray-300 rounded-lg"
                                :class="currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-50'">
                                Next
                            </button>
                            <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
                                class="px-4 py-2 border border-gray-300 rounded-lg"
                                :class="currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-50'">
                                Last
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Large Promo Banner -->
            <HomeSaleBanner />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from '~/components/ui/ProductCard.vue';
import { products } from '~/mock/products';
import { categories } from '~/mock/categories';

const route = useRoute();
const router = useRouter();

// Filters
const activeCategory = ref('all');
const availabilityFilters = ref<string[]>([]);
const priceRange = ref<number[]>([0, 2000]);
const selectedColors = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(9);
const sortOption = ref('name-asc');

// Color options
const colors = [
    { value: 'yellow', hex: '#EAB308' },
    { value: 'red', hex: '#EF4444' },
    { value: 'indigo', hex: '#312E81' },
    { value: 'green', hex: '#22C55E' },
    { value: 'blue', hex: '#1D4ED8' },
    { value: 'purple', hex: '#9333EA' },
    { value: 'pink', hex: '#EC4899' },
    { value: 'lime', hex: '#84CC16' },
];

// Set active category
const setCategory = (category: string) => {
    activeCategory.value = category;
    currentPage.value = 1;
};

// Toggle color selection
const toggleColor = (color: string) => {
    if (selectedColors.value.includes(color)) {
        selectedColors.value = selectedColors.value.filter(c => c !== color);
    } else {
        selectedColors.value.push(color);
    }
    currentPage.value = 1;
};

// Reset all filters
const resetFilters = () => {
    activeCategory.value = 'all';
    availabilityFilters.value = [];
    priceRange.value = [0, maxPrice.value];
    selectedColors.value = [];
    currentPage.value = 1;
};

// Count products by availability
const inStockCount = computed(() =>
    products.filter(product => product.stock > 0).length
);

const outOfStockCount = computed(() =>
    products.filter(product => product.stock === 0).length
);

// Get max price for range filter
const maxPrice = computed(() => {
    const prices = products.map(p => p.price);
    return Math.max(...prices);
});

// Filter products
const filteredProducts = computed(() => {
    // Start with all products
    let result = [...products];

    // Filter by search query from URL
    const searchQuery = route.query.search as string;
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
    }

    // Filter by category
    if (activeCategory.value !== 'all') {
        result = result.filter(p => p.category === activeCategory.value);
    }

    // Filter by availability
    if (availabilityFilters.value.length > 0) {
        if (availabilityFilters.value.includes('in-stock') && !availabilityFilters.value.includes('out-of-stock')) {
            result = result.filter(p => p.stock > 0);
        } else if (!availabilityFilters.value.includes('in-stock') && availabilityFilters.value.includes('out-of-stock')) {
            result = result.filter(p => p.stock === 0);
        }
    }

    // Filter by price range
    result = result.filter(p =>
        p.price >= priceRange.value[0] &&
        p.price <= priceRange.value[1]
    );

    // Sort products
    switch (sortOption.value) {
        case 'name-asc':
            result.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            result.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'price-asc':
            result.sort((a, b) => {
                const priceA = a.discountedPrice || a.price;
                const priceB = b.discountedPrice || b.price;
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            result.sort((a, b) => {
                const priceA = a.discountedPrice || a.price;
                const priceB = b.discountedPrice || b.price;
                return priceB - priceA;
            });
            break;
        case 'rating-desc':
            result.sort((a, b) => b.rating - a.rating);
            break;
    }

    return result;
});

// Paginate products
const paginatedProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return filteredProducts.value.slice(startIndex, endIndex);
});

// Calculate total pages
const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / itemsPerPage.value)
);

// Initialize from URL params
onMounted(() => {
    const { search, category } = route.query;

    if (category && typeof category === 'string') {
        activeCategory.value = category;
    }

    // Set price range to min/max of products on first load
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxProductPrice = Math.max(...prices);
    priceRange.value = [minPrice, maxProductPrice];
});

// Update URL when filters change
watch([activeCategory, sortOption], () => {
    router.push({
        query: {
            ...route.query,
            category: activeCategory.value === 'all' ? undefined : activeCategory.value,
            sort: sortOption.value
        }
    });
});
</script>