<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 mb-8">
            <NuxtLink to="/" class="text-gray-500 hover:text-primary">Home</NuxtLink>
            <span class="text-gray-500">&gt;</span>
            <span class="text-gray-700">Cart</span>
        </div>

        <div v-if="cartItems.length > 0" class="flex flex-col lg:flex-row gap-8">
            <!-- Cart Items -->
            <div class="lg:w-2/3">
                <!-- Cart Header -->
                <div class="hidden md:grid md:grid-cols-12 bg-blue-50 p-4 rounded-t-lg text-gray-700 font-medium">
                    <div class="col-span-5">Product</div>
                    <div class="col-span-2 text-center">Price</div>
                    <div class="col-span-3 text-center">Quantity</div>
                    <div class="col-span-2 text-center">Subtotal</div>
                </div>

                <!-- Cart Items -->
                <div class="border-x border-b border-gray-200 rounded-b-lg">
                    <div v-for="item in cartItems" :key="item.product.id" class="border-t border-gray-200 p-4">
                        <div class="md:grid md:grid-cols-12 flex flex-col gap-4 items-start md:items-center">
                            <!-- Product -->
                            <div class="col-span-5 flex gap-4 items-center">
                                <button 
                                    @click="removeFromCart(item.product.id)" 
                                    class="text-gray-400 hover:text-red-500"
                                >
                                    <icon name="ph:x-circle" />
                                </button>
                                <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <NuxtImg 
                                        :src="item.product.images[0]" 
                                        :alt="item.product.title" 
                                        class="max-h-16 max-w-16 object-contain" 
                                    />
                                </div>
                                <div>
                                    <NuxtLink :to="`/products/${item.product.id}`" class="font-medium text-gray-800 hover:text-primary">
                                        {{ item.product.title }}
                                    </NuxtLink>
                                    <div class="text-sm text-gray-500 mt-1">
                                        <div>Color: {{ item.product.category === 'games' ? 'Green' : 'Black' }}</div>
                                        <div>Size: 30</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Price -->
                            <div class="col-span-2 text-center">
                                <div class="md:hidden font-medium text-gray-700 mb-1">Price:</div>
                                <div class="font-semibold">{{ formatPrice(item.product.discountedPrice || item.product.price) }}</div>
                            </div>

                            <!-- Quantity -->
                            <div class="col-span-3 flex flex-col md:items-center">
                                <div class="md:hidden font-medium text-gray-700 mb-1">Quantity:</div>
                                <div class="flex items-center">
                                    <button 
                                        @click="decreaseQuantity(item.product.id)" 
                                        class="w-8 h-8 border border-gray-300 rounded-l-lg flex items-center justify-center"
                                    >
                                        <icon name="ph:minus" />
                                    </button>
                                    <input 
                                        type="text" 
                                        v-model="item.quantity" 
                                        @blur="updateItemQuantity(item.product.id, parseInt(item.quantity.toString()) || 1)"
                                        class="w-12 h-8 border-t border-b border-gray-300 text-center" 
                                    />
                                    <button 
                                        @click="increaseQuantity(item.product.id, item.product.stock)" 
                                        class="w-8 h-8 border border-gray-300 rounded-r-lg flex items-center justify-center"
                                    >
                                        <icon name="ph:plus" />
                                    </button>
                                </div>
                            </div>

                            <!-- Subtotal -->
                            <div class="col-span-2 md:text-center">
                                <div class="md:hidden font-medium text-gray-700 mb-1">Subtotal:</div>
                                <div class="font-semibold">
                                    {{ formatPrice((item.product.discountedPrice || item.product.price) * item.quantity) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-4 mt-6">
                    <NuxtLink to="/products" class="px-6 py-3 bg-primary-system text-gray-800 rounded-lg hover:bg-primary-system/80 font-medium">
                        Continue shopping
                    </NuxtLink>
                    <button 
                        @click="updateCartItems" 
                        class="px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Update cart
                    </button>
                    <button 
                        @click="clearCart" 
                        class="px-6 py-3 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                    >
                        Clear cart
                    </button>
                </div>
            </div>

            <!-- Cart Summary -->
            <div class="lg:w-1/3">
                <div class="bg-blue-50 p-6 rounded-lg">
                    <h2 class="text-xl font-bold text-gray-800 mb-6">Cart total</h2>

                    <div class="border-b border-gray-200 pb-4 mb-4">
                        <div class="flex justify-between mb-4">
                            <span class="text-gray-700">Subtotal</span>
                            <span class="font-semibold">{{ formatPrice(cartTotal) }}</span>
                        </div>

                        <div v-if="discount > 0" class="flex justify-between mb-4 text-green-600 bg-green-50 p-2 rounded">
                            <span>Discount (10%)</span>
                            <span class="font-semibold">-{{ formatPrice(discount) }}</span>
                        </div>

                        <!-- Coupon Form -->
                        <div class="flex mt-4">
                            <input
                                type="text"
                                v-model="couponCode"
                                placeholder="Enter coupon code"
                                class="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                                :class="{'border-green-500 bg-green-50': couponApplied}"
                            />
                            <button
                                @click="applyCoupon"
                                class="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark"
                                :class="{'bg-green-500': couponApplied}"
                            >
                                {{ couponApplied ? 'Applied' : 'Apply' }}
                            </button>
                        </div>
                    </div>

                    <!-- Country Selector -->
                    <div class="mb-6">
                        <div class="relative">
                            <select
                                v-model="selectedCountry"
                                class="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option disabled value="">Select country</option>
                                <option v-for="country in countries" :key="country" :value="country">
                                    {{ country }}
                                </option>
                            </select>
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <icon name="ph:caret-down" />
                            </div>
                        </div>
                    </div>

                    <!-- Total Amount -->
                    <div class="flex justify-between mb-6">
                        <span class="text-gray-700">Total amount</span>
                        <span class="font-bold text-xl">{{ formatPrice(finalTotal) }}</span>
                    </div>

                    <!-- Checkout Button -->
                    <button
                        @click="proceedToCheckout"
                        class="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium"
                    >
                        Proceed to checkout
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty Cart -->
        <div v-else class="text-center py-12">
            <div class="text-8xl text-gray-200 mb-6 flex justify-center">
                <icon name="ph:shopping-cart" />
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p class="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <NuxtLink to="/products" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium">
                Continue shopping
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart';
import { usePrice } from '~/composables/usePrice';
import { useNotification } from '~/composables/useNotification';

definePageMeta({
    layout: 'default'
});

// Get cart functions and data
const { cart: cartItems, cartTotal, updateQuantity: updateItemQuantity, removeFromCart, clearCart } = useCart();
const { formatPrice } = usePrice();
const { success, error } = useNotification();

// Coupon and discounts
const couponCode = ref('');
const discount = ref(0);
const couponApplied = ref(false);

const applyCoupon = () => {
    if (couponCode.value.trim() === '') {
        error('Please enter a coupon code');
        return;
    }

    if (couponCode.value.toLowerCase() === 'discount10') {
        discount.value = cartTotal.value * 0.1;
        couponApplied.value = true;
        success('Coupon applied successfully!');
    } else {
        couponApplied.value = false;
        error('Invalid coupon code');
    }
};

// Country selection
const selectedCountry = ref('United States');
const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'Brazil',
    'Italy',
    'Spain'
];

// Calculate final total
const finalTotal = computed(() => {
    return cartTotal.value - discount.value;
});

// Quantity handlers
const increaseQuantity = (productId: number, maxStock: number) => {
    const item = cartItems.value.find(item => item.product.id === productId);
    if (item) {
        const newQuantity = item.quantity + 1;
        if (newQuantity <= maxStock) {
            updateItemQuantity(productId, newQuantity);
        } else {
            error(`Sorry, only ${maxStock} items available in stock`);
        }
    }
};

const decreaseQuantity = (productId: number) => {
    const item = cartItems.value.find(item => item.product.id === productId);
    if (item && item.quantity > 1) {
        updateItemQuantity(productId, item.quantity - 1);
    }
};

// Update cart (recalculate, etc.)
const updateCartItems = () => {
    // Just refresh the cart values - in a real app, this might send to an API
    success('Cart updated successfully');
};

// Proceed to checkout
const proceedToCheckout = () => {
    // In a real app, this would navigate to the checkout page
    success('Proceeding to checkout...');
};
</script> 