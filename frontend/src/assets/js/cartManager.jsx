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
        cart.push({
            product: product,
            quantity: quantity
        });
    }

    updateCartBadge();
    updateLocalStorage('cart', cart);

    // Return the updated cart for React components
    return [...cart];
}

// Update cart badge
export function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (!cartBadge) return;

    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    if (itemCount > 0) {
        cartBadge.textContent = itemCount > 99 ? '99+' : itemCount;
        cartBadge.classList.remove('hidden');
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

    // Return the updated cart for React components
    return [...cart];
}

// Toggle cart sidebar (for non-React code)
export function toggleCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (!cartSidebar) return;

    cartSidebar.classList.toggle('translate-x-full');

    if (!cartSidebar.classList.contains('translate-x-full')) {
        document.body.style.overflow = 'hidden'; // Prevent body scrolling
    } else {
        document.body.style.overflow = ''; // Re-enable body scrolling
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
