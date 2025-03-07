// Format price with Vietnamese currency
export function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
}

// Generate star rating HTML
export function generateRatingStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }

    return starsHtml;
}

// Get icon for product
export function getProductIcon(product) {
    // Map of product icons
    const iconMap = {
        "rice-cooker": "fa-solid fa-bowl-rice",
        "blender": "fa-solid fa-blender",
        "bed": "fa-solid fa-bed",
        "lamp": "fa-solid fa-lightbulb",
        "utensils": "fa-solid fa-utensils",
        "mirror": "fa-solid fa-circle",
        "shower": "fa-solid fa-shower",
        "couch": "fa-solid fa-couch",
        "coffee": "fa-solid fa-mug-hot",
        "pepper-hot": "fa-solid fa-pepper-hot",
        "window-maximize": "fa-solid fa-window-maximize"
    };

    return iconMap[product.icon] || "fa-solid fa-box";
}

// Set up dark mode detection
export function setupDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
}