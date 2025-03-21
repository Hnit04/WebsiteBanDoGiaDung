import { updateLocalStorage, getFromLocalStorage } from './storageUtils.js';

// Shopping cart functionality
let cart = [];

// Initialize cart from localStorage if available
export function initCart() {
    const savedCart = getFromLocalStorage('cart');
    if (savedCart) {
        cart = savedCart;
    }
}

// Add product to cart
export function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }

    updateCartBadge();
    updateLocalStorage('cart', cart);

    return [...cart]; // Return updated cart
}

// Update cart badge with Tailwind styles
export function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (!cartBadge) return;

    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    if (itemCount > 0) {
        cartBadge.textContent = itemCount > 99 ? '99+' : itemCount;
        cartBadge.classList.remove('hidden');
        cartBadge.classList.add('bg-red-500', 'text-white', 'rounded-full', 'w-5', 'h-5', 'flex', 'items-center', 'justify-center', 'text-xs', 'absolute', '-top-2', '-right-2');
    } else {
        cartBadge.classList.add('hidden');
    }
}

// Remove item from cart
export function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartBadge();
        updateLocalStorage('cart', cart);
    }
    return [...cart]; // Return updated cart
}

// Toggle cart sidebar using Tailwind
export function toggleCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (!cartSidebar) return;

    cartSidebar.classList.toggle('translate-x-full');

    if (!cartSidebar.classList.contains('translate-x-full')) {
        document.body.classList.add('overflow-hidden'); // Prevent scrolling
    } else {
        document.body.classList.remove('overflow-hidden'); // Enable scrolling
    }
}

// Get cart
export function getCart() {
    return [...cart]; // Return a copy of the cart array
}

// Clear cart
export function clearCart() {
    cart = [];
    updateCartBadge();
    updateLocalStorage('cart', cart);
    return [];
}

// Initialize cart on load
initCart();
